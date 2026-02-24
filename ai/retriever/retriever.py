"""
docstring for ai.retriever.Retriever

"""
import numpy as np
from typing import List, Tuple
from sklearn.metrics.pairwise import cosine_similarity


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




