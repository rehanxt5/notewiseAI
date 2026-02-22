import uuid
import re
from typing import List, Dict, Any
from llama_index.core.node_parser import MarkdownNodeParser, SentenceSplitter
from llama_index.core.schema import TextNode, NodeRelationship, BaseNode

class HierarchicalChunker:
    def __init__(self, child_chunk_size: int = 256, child_overlap: int = 50):
        """
        A robust chunker that preserves the integrity of:
        1. Tables (Markdown)
        2. Code Blocks (```...```)
        3. Math Blocks ($$...$$)
        4. Lists (Ordered and Unordered)
        
        Args:
            child_chunk_size: Token size for standard text (non-atomic).
            child_overlap: Overlap for standard text to maintain context.
        """
        # 1. Parent Parser: Flattens document by Headers (#, ##)
        # This gives us the "Container" (Section Context)
        self.parent_parser = MarkdownNodeParser(
            include_metadata=True,
            include_prev_next_rel=True
        )
        
        # 2. Text Splitter: Handles ONLY the normal text between atomic blocks
        self.child_splitter = SentenceSplitter(
            chunk_size=child_chunk_size, 
            chunk_overlap=child_overlap
        )

        # 3. Atomic Regex Patterns (Compiled for speed)
        # Captures: Code Blocks OR Tables OR Math Blocks OR Lists
        # Order matters: match longer/more specific patterns first
        self.atomic_pattern = re.compile(
            r'(```[\s\S]*?```)|'                                                      # Code Blocks
            r'(\|.+\|[\r\n]+\|[\s:|-]+\|[\r\n]+(?:\|.+\|[\r\n]*)+)|'                 # Markdown Tables
            r'(\$\$[\s\S]*?\$\$)|'                                                    # Math Blocks (block)
            r'((?:^[ \t]*[-*+]\s+.+$(?:\n(?:[ \t]+.+$|[ \t]*[-*+]\s+.+$))*\n?)+)|'  # Unordered Lists
            r'((?:^[ \t]*\d+\.\s+.+$(?:\n(?:[ \t]+.+$|[ \t]*\d+\.\s+.+$))*\n?)+)',  # Ordered Lists
            re.MULTILINE
        )

    def run(self, doc_text: str, file_name: str) -> Dict[str, Any]:
        """
        Main Pipeline Execution.
        """
        # A. Create Base Node
        base_node = TextNode(text=doc_text, metadata={"file_name": file_name})
        
        # B. Generate PARENTS (Logical Sections)
        # Returns a flat list of sections. Each section contains ALL its text/code/tables.
        parent_nodes = self.parent_parser.get_nodes_from_documents([base_node])
        
        final_parents = []
        all_children = []

        print(f"--> [Pipeline] Identified {len(parent_nodes)} Logical Sections (Parents).")

        for parent in parent_nodes:
            # 1. Assign Deterministic ID (if missing)
            if not parent.node_id:
                parent.node_id = str(uuid.uuid4())
            
            # 2. Enrich Parent Metadata
            # 'header_path' is automatically added by MarkdownNodeParser
            # e.g., "Report > Financials > Q3"
            header_path = parent.metadata.get("header_path", "General")
            parent.metadata.update({
                "is_parent": True,
                "section_depth": len(header_path.split("/")) if header_path else 0
            })
            final_parents.append(parent)

            # 3. Generate CHILDREN (Atomic + Text)
            # This is where we protect tables/code from being split
            section_children = self._process_section_content(parent)
            all_children.extend(section_children)

        return {
            "parents": final_parents,
            "children": all_children
        }

    def _process_section_content(self, parent_node: BaseNode) -> List[TextNode]:
        """
        Scans a Parent Node's text.
        - Identifies Atomic Blocks -> Creates WHOLE Child Nodes.
        - Identifies Normal Text -> Splits into small Child Nodes.
        """
        text = parent_node.text
        child_nodes = []
        last_pos = 0
        
        # Iterate over all Atomic Matches in the parent text
        for match in self.atomic_pattern.finditer(text):
            # A. Process Normal Text BEFORE the atomic block
            text_before = text[last_pos:match.start()].strip()
            if text_before:
                # Split normal text using standard sliding window
                text_chunks = self.child_splitter.split_text(text_before)
                for chunk in text_chunks:
                    child_nodes.append(self._create_child(parent_node, chunk, "text_fragment"))

            # B. Process the ATOMIC Block
            content = match.group(0).strip()
            
            # Determine specific type for metadata filtering
            if content.startswith("```"):
                node_type = "code_block"
            elif content.startswith("|"):
                node_type = "table"
            elif content.startswith("$$"):
                node_type = "math_block"
            elif re.match(r'^[\s]*[-*+]\s+', content, re.MULTILINE):
                node_type = "unordered_list"
            elif re.match(r'^[\s]*\d+\.\s+', content, re.MULTILINE):
                node_type = "ordered_list"
            else:
                node_type = "math_block"
            
            # Create a SINGLE child for the entire block (No splitting)
            child_nodes.append(self._create_child(parent_node, content, node_type))
            
            last_pos = match.end()

        # C. Process Normal Text AFTER the last block
        text_after = text[last_pos:].strip()
        if text_after:
            text_chunks = self.child_splitter.split_text(text_after)
            for chunk in text_chunks:
                child_nodes.append(self._create_child(parent_node, chunk, "text_fragment"))
                
        return child_nodes

    def _create_child(self, parent_node: BaseNode, text_content: str, node_type: str) -> TextNode:
        """
        Creates a Child Node linked to the Parent.
        """
        child = TextNode(text=text_content)
        child.node_id = str(uuid.uuid4())
        
        # 1. The Critical Link (Child -> Parent)
        child.relationships[NodeRelationship.PARENT] = parent_node
        
        # 2. Inherit Metadata (File Name, Header Path, etc.)
        child.metadata = parent_node.metadata.copy()
        
        # 3. Add Child-Specific Metadata
        child.metadata.update({
            "parent_id": parent_node.node_id,  # FK for Database
            "node_type": node_type,            # 'table', 'code_block', 'text_fragment'
            "is_child": True,
            "is_parent": False,
            "content_length": len(text_content)
        })
        
        return child
