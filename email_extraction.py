import email
from email import policy
from email.parser import BytesParser
import spacy
from sentence_transformers import SentenceTransformer
import pinecone
from flask import Flask, request

# Email Parsing

def parse_email(raw_email):
    msg = BytesParser(policy=policy.default).parsebytes(raw_email)
    subject = msg['subject']
    body = msg.get_body(preferencelist=('plain')).get_content()
    return subject, body

# NLP Model
nlp = spacy.load("en_core_web_sm")

# Extracting Invoice Details

def extract_invoice_details(email_body):
    doc = nlp(email_body)
    invoice_details = {}
    for ent in doc.ents:
        if ent.label_ == "MONEY":
            invoice_details['amount'] = ent.text
        elif ent.label_ == "DATE":
            invoice_details['date'] = ent.text
    return invoice_details

# Vectorization
model = SentenceTransformer('all-MiniLM-L6-v2')

def vectorize_email_content(email_body):
    return model.encode(email_body)

# Pinecone Initialization
pinecone.init(api_key='YOUR_API_KEY', environment='YOUR_ENVIRONMENT')
index_name = 'email-extraction'
pinecone.create_index(index_name, dimension=384)
index = pinecone.Index(index_name)

# Storing Email Vector

def store_email_vector(email_id, vector, metadata):
    index.upsert([(email_id, vector, metadata)])

# Store Email Function

def store_email(email_id, subject, body):
    invoice_details = extract_invoice_details(body)
    vector = vectorize_email_content(body)
    metadata = {
        'subject': subject,
        'sender': 'example@example.com',  # Replace with actual sender
        'invoice_details': invoice_details
    }
    store_email_vector(email_id, vector, metadata)

# Flask Webhook
app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    raw_email = request.data
    subject, body = parse_email(raw_email)
    email_id = 'unique_email_id'  # Generate a unique ID for the email
    store_email(email_id, subject, body)
    return 'Email processed', 200

if __name__ == '__main__':
    app.run(port=5000)
