# Kazimatch Backend Service

KaziMatch is a platform that connects job seekers with employers. The platform is designed to help job seekers find jobs that match their skills and experience. Employers can use the platform to find qualified candidates for their job openings. The platform uses a matching algorithm to connect job seekers with employers based on their skills and experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

1. Node.js
2. NPM
3. Docker & Docker Compose

### Installing

A step by step series of examples that tell you how to get a development env running

1. Clone the repository

```bash
git clone https://github.com/bryanbill/kazimatch-backend.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables

```bash
cp .env.example .env
```

4. Start Docker

```bash
docker-compose up -d
```

5. Start the development server

```bash
npm run dev
```

## Running the tests

Explain how to run the automated tests for this system

```bash
npm run test
```
