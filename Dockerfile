FROM nikolaik/python-nodejs:python3.8-nodejs14 as build

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm i

COPY Pipfile /home/app/
COPY Pipfile.lock /home/app/

RUN pip3.8 install pipenv 
RUN pipenv install

COPY . /home/app