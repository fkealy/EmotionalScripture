from setuptools import setup, find_packages

setup(
    name="emotion_generator",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "pydantic>=2.0.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "loguru>=0.7.0",
    ],
) 