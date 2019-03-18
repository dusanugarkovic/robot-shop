FROM python:3.7

EXPOSE 8080

ENV AUTOWRAPT_BOOTSTRAP=flask

WORKDIR /catalogue

COPY requirements.txt /catalogue/

RUN pip install -r requirements.txt

COPY catalogue.py /catalogue/

CMD ["python3", "catalogue.py"]

