from loguru import logger
import sys
import os
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs("emotion_generator/data/logs", exist_ok=True)

# Generate log filename with timestamp
log_filename = f"emotion_generator/data/logs/emotion_generator_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

# Configure logger
logger.remove()  # Remove default handler
logger.add(sys.stderr, level="INFO")  # Add stderr handler
logger.add(log_filename, rotation="500 MB", level="DEBUG")  # Add file handler

def get_logger():
    return logger 