"""
docstring for ai.retriever.Retriever

"""
import numpy as np
from typing import List, Tuple
from sklearn.metrics.pairwise import cosine_similarity

class Retriever:
    """
    A class for retrieving relevant documents based on dense and sparse retrieval methods.
    """
    @staticmethod
    def dense_retriever(query_embedding:np.ndarray , document_embeddings:List[np.ndarray], top_k:int = 5) -> List[Tuple[int, float]]:
        """
        Retrieve the top_k most relevant documents based on cosine similarity.

        Args:
            query_embedding (np.ndarray): The embedding of the query.
            document_embeddings (List[np.ndarray]): A list of embeddings for the documents.
            top_k (int): The number of top relevant documents to retrieve.

        Returns:
            List[Tuple[int, float]]: A list of tuples containing the index and similarity score of the top_k relevant documents.
        """
        similarities = cosine_similarity(query_embedding.reshape(1, -1), document_embeddings).flatten()
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [(index, similarities[index]) for index in top_indices]

    @staticmethod
    def sparse_retriever(query: str, documents: List[str], top_k: int = 5) -> List[Tuple[int, float]]:
        """
        Retrieve the top_k most relevant documents based on term frequency.

        Args:
            query (str): The query string.
            documents (List[str]): A list of document strings.
            top_k (int): The number of top relevant documents to retrieve.

        Returns:
            List[Tuple[int, float]]: A list of tuples containing the index and relevance score of the top_k relevant documents.
        """
        query_terms = set(query.split())
        relevance_scores = []
        
        for index, document in enumerate(documents):
            document_terms = set(document.split())
            common_terms = query_terms.intersection(document_terms)
            relevance_score = len(common_terms) / len(query_terms) if query_terms else 0
            relevance_scores.append((index, relevance_score))
        
        relevance_scores.sort(key=lambda x: x[1], reverse=True)
        return relevance_scores[:top_k]

    def __rrf_fusion__(self, dense_results: List[Tuple[int, float]], sparse_results: List[Tuple[int, float]], alpha: float = 0.5) -> List[Tuple[int, float]]:
        """
        Fuse the results from dense and sparse retrievers using Reciprocal Rank Fusion (RRF).

        Args:
            dense_results (List[Tuple[int, float]]): The results from the dense retriever.
            sparse_results (List[Tuple[int, float]]): The results from the sparse retriever.
            alpha (float): The weight for the dense retriever in the fusion.
        Returns:
            List[Tuple[int, float]]: A list of tuples containing the index and fused relevance score of the top_k relevant documents.
        """
        fused_scores = {}
        
        for index, score in dense_results:
            fused_scores[index] = fused_scores.get(index, 0) + alpha * (1 / (index + 1))
        
        for index, score in sparse_results:
            fused_scores[index] = fused_scores.get(index, 0) + (1 - alpha) * (1 / (index + 1))
        
        fused_results = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
        return fused_results

    def hybrid_retriever(self, query: str, query_embedding: np.ndarray, documents: List[str], document_embeddings: List[np.ndarray], top_k: int = 5, alpha: float = 0.5) -> List[Tuple[int, float]]:
        """
        Retrieve the top_k most relevant documents using a hybrid approach that combines dense and sparse retrieval methods.

        Args:
            query (str): The query string.
            query_embedding (np.ndarray): The embedding of the query.
            documents (List[str]): A list of document strings.
            document_embeddings (List[np.ndarray]): A list of embeddings for the documents.
            top_k (int): The number of top relevant documents to retrieve.
            alpha (float): The weight for the dense retriever in the fusion.
        Returns:
            List[Tuple[int, float]]: A list of tuples containing the index and fused relevance score of the top_k relevant documents.
        """
        dense_results = self.dense_retriever(query_embedding, document_embeddings, top_k)
        sparse_results = self.sparse_retriever(query, documents, top_k)
        fused_results = self.__rrf_fusion__(dense_results, sparse_results, alpha)
        return fused_results[:top_k]