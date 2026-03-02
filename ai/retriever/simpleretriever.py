'''
docstring for ai.retriever.simpleretriever.SimpleRetriever
'''
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from FlagEmbedding import BGEM3FlagModel
class SimpleRetriever:
    '''
    A simple retriever that uses cosine similarity to retrieve relevant documents based on query embeddings.
    '''
    
    @staticmethod
    def dense_retrieve(query_embedding: np.ndarray, document_embeddings: np.ndarray, top_k=5):
        '''
        Retrieve the top_k most relevant documents based on cosine similarity between query and document embeddings.

        Args:
            query_embedding (list or np.array): The embedding vector for the query. [1D array]
            document_embeddings (list of list or np.array): A list of embedding vectors for the documents. [2D array]
            top_k (int): The number of top relevant documents to retrieve.
        Returns:
            list: A list of indices corresponding to the top_k most relevant documents.
        '''
        # Compute cosine similarities between query and document embeddings
        similarities = cosine_similarity([query_embedding], document_embeddings)[0]

        # Get the indices of the top_k most similar documents
        top_k_indices = np.argsort(similarities)[-top_k:][::-1]
        return top_k_indices.tolist()

    @staticmethod
    def sparse_retrieve(model,query_vector:np.ndarray, document_vectors:np.ndarray, top_k=5):
        '''
        Retrieve the top_k most relevant documents based on cosine similarity between query and document vectors.

        Args:
            query_vector (np.array): The sparse vector for the query. [1D array]
            document_vectors (np.array): A 2D array of sparse vectors for the documents. [2D array]
            top_k (int): The number of top relevant documents to retrieve.
        Returns:
            list: A list of indices corresponding to the top_k most relevant documents.
        '''
        similarities = model.cosine_similarity(query_vector, document_vectors)
        top_k_indices = np.argsort(similarities)[-top_k:][::-1]
        return top_k_indices.tolist()
    
    def __rrf_fusion__(dense_indices, sparse_indices, k=60):
        '''
        Perform Reciprocal Rank Fusion (RRF) to combine dense and sparse retrieval results.

        Args:
            dense_indices (list): List of document indices retrieved by the dense retriever.
            sparse_indices (list): List of document indices retrieved by the sparse retriever.
            k (int): The value of k for RRF.
        Returns:
            list: A list of document indices ranked by their combined relevance.
        '''
        # Create a score dictionary to hold the combined scores
        score_dict = {}
        for rank, idx in enumerate(dense_indices):
            score_dict[idx] = score_dict.get(idx, 0) + 1 / (rank + k)

        for rank, idx in enumerate(sparse_indices):
            score_dict[idx] = score_dict.get(idx, 0) + 1 / (rank + k)
        # Return the indices sorted by their combined scores in descending order
        return sorted(score_dict.keys(), key=lambda x: score_dict[x], reverse=True)
    @staticmethod
    def hybrid_retrieve(model, dense_embeddings, sparse_embeddings,top_k=5, k=60):
        '''
        Perform hybrid retrieval by combining dense and sparse retrieval results using RRF.

        Args:
            model: The model used for sparse retrieval.
            dense_embeddings (list of list or np.array): A list of embedding vectors for the documents. [2D array]
            sparse_embeddings (list of list or np.array): A list of sparse embedding vectors for the documents. [2D array]
            k (int): The value of k for RRF.
        Returns:
            list: A list of document indices ranked by their combined relevance.
        '''
        dense_indices = SimpleRetriever.dense_retrieve(dense_embeddings, top_k=top_k)
        sparse_indices = SimpleRetriever.sparse_retrieve(model, sparse_embeddings, top_k=top_k)
        return SimpleRetriever.__rrf_fusion__(dense_indices, sparse_indices, k=k)
    