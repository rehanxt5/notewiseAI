'''
docstring for ai.ingestion.embedder.Embedder
'''
from google import genai
from google.genai import types


class Embedder:
    '''
    Base class for embedding models.
    '''
    def __init__(self, model_name: str = "bge-m3", mode:str ='local', api_key:str = None):
        if model_name not in ["google-embedding-1","bge-m3"]:
            raise ValueError(f"Unsupported model_name: {model_name}. Supported models are: 'text-embedding-3-small', 'text-embedding-3-large'.")
        if mode not in ["local", "api"]:
            raise ValueError(f"Unsupported mode: {mode}. Supported modes are: 'local', 'api'.")
        if mode == "api" and not api_key:
            raise ValueError("API key is required for API mode.")
        if model_name == "google-embedding-1" and mode == "local":
            raise ValueError("Google Embedding 1 is only available in API mode.")
        self.model_name = model_name
        self.mode = mode
        self.__api_key__ = api_key
    def embed_query(self,text):
        '''
        Embed a query using the specified model.
        '''

        if self.model_name == "google-embedding-1":
            return self.__embed_google_embedding_1__(text)
        elif self.model_name == "bge-m3":
            return self._embed_bge_m3(text)
    def embed_documents(self,documents:list):
        '''
        Embed a list of documents using the specified model.
        '''
        if self.model_name == "google-embedding-1":
            return self.__embed_google_embedding_1__(documents)
        elif self.model_name == "bge-m3":
            return self.__embed_bge_m3__(documents)
    
    def __embed_google_embedding_1__(self,text_or_docs):
        '''
        Embed text or documents using Google Embedding 1 via API.
        '''
        client = genai.Client(api_key=self.__api_key__)
        
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text_or_docs,
        )
        # response.embeddings is always a list of ContentEmbedding objects
        if isinstance(text_or_docs, list):
            return [emb.values for emb in response.embeddings]
        else:
            return response.embeddings[0].values

    def __embed_bge_m3__(self,text_or_docs):
        '''
        Embed text or documents using BGE-M3 via local/api model.
        '''
        pass