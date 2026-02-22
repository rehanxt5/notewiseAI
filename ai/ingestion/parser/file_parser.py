
"""
File Parser Module

This module provides functionality for parsing various file formats commonly used in document processing.
It handles the conversion and extraction of content from multiple file types into a unified format.

Supported Formats:
    - TXT: Plain text files
    - MD: Markdown files
    - PDF: Portable Document Format files
        - Scanned PDFs (image-based, OCR-capable)
        - Indexed PDFs (text-based, searchable)

Key Features:
    - Automatic file format detection
    - PDF to Markdown conversion for both scanned and indexed documents
    - Content extraction and standardization
    - Support for multi-page documents

Usage:
    The parser processes input files and converts them into a standardized markdown format,
    making it easier to work with different document types in a unified pipeline.
"""
from llama_parse import LlamaParse



def textParse(file_path):
    """
    Parses a plain text file and returns its content as a string.

    Args:
        file_path (str): The path to the text file to be parsed.
    Returns:
        str: The content of the text file.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except Exception as e:
        print(f"Error parsing text file: {e}")
        return None

def markdownParse(file_path):
    """
    Parses a markdown file and returns its content as a string.

    Args:
        file_path (str): The path to the markdown file to be parsed.
    Returns:
        str: The content of the markdown file.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except Exception as e:
        print(f"Error parsing markdown file: {e}")
        return None

def llamapdfParse(
        file_path, 
        api_key,
        parsing_instruction="""
            Extract document fully.
            If page has text layer, use it.
            If page is scanned, apply OCR.
            Preserve headings and tables.
            Keep page boundaries logical.
        """):
    
    """
    Parses a PDF file (both scanned and indexed) and returns its content as a string.

    Args:
        file_path (str): The path to the PDF file to be parsed.
    Returns:
        str: The content of the PDF file in markdown format.
    """

    try:
        parser = LlamaParse(
            api_key=api_key,
            premium_mode = True,
            parsing_instruction=parsing_instruction,
            verbose=True
        )

        documents = parser.load_data(file_path)
        full_markdown = "\n\n".join([doc.text for doc in documents])

        return full_markdown
    except Exception as e:
        print(f"Error parsing PDF file: {e}")
        return None
