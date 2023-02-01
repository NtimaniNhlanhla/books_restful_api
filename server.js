const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParder = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')


// Load env files
dotenv.config({ path: './config/config.env'});

// Connect to database
connectDB();

//Route Files
const bootcamp = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

const app = express();

// Body parser
app.use(express.json())

app.use(cookieParder())

// Dev loggin middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// File Upload 
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
    windowMS: 10 * 60 * 1000, // 10 min
max:100
});

app.use(limiter);

// Prevent hppt param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamp)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
})

