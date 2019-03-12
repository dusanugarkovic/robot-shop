FROM python:3.7

WORKDIR /caller

COPY requirements.txt /caller/

RUN pip install -r requirements.txt

COPY calls.py /caller/
COPY shopping.py /caller/
COPY loader.py /caller/

CMD ["python3", "./loader.py"]

