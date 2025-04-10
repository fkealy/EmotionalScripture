print("Testing Python environment")

try:
    import pydantic
    print("Pydantic version:", pydantic.__version__)
except ImportError:
    print("Failed to import pydantic") 