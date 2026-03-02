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
     
