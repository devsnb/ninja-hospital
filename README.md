# Introduction

This project is built with express.js nodejs framework & mongoose.

This project is a authentication system built according to the requirements of CondingNinjas Backend Skill Assessment test 3.

# Setup

To set up a local development environment, copy all contents form development.example.env.json from the root of the project, then create a new file, `development.json` in the same location and paste the copied contents. Now add fill out all the necessary details.

now in you terminal navigate to the root of the project & run:

```bash
npm install
```

after the first command is finished executing, run:

```bash
npm run dev
```

now your development server should be up on running on the port you specified

# Pages

This project has the following pages:

- /doctors/register -> Authentication Not Required
- /doctors/login -> Authentication Not Required
- /patients/register -> Authentication Required
- /patients/:id/create_report -> Authentication Required
- /patients/:id/all_reports -> Authentication Required
- /reports/:status -> Authentication Required

# Usage

This project requires you to register & login to the application first to perform any operation.
