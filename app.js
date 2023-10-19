const express = require('express');
const app = express();
const port = 3001;
var mysql = require('mysql');
const cors = require('cors');
var bodyParser = require('body-parser');


//handle Authentication
var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: 'test123',
 database: "loancalculator"
});
con.connect();


app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true }));



// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
 res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'}); //Line 10
}); //Line 11


// Authenticate user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log();
  let select_query = "SELECT * FROM users WHERE email = ?";
  con.query(select_query, [email], function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      if (result && result.length > 0) {
        // Generate and send auth token
        const token = generateAuthToken(result[0].id); // Assuming you want the first user's ID
        res.send({ token });
      } else {
        res.status(401).send('Invalid email or password');
      }
    }
  });
});

// Generate authentication token
function generateAuthToken(userId) {
 // Use a library like jsonwebtoken to generate JWTs
 return 'sample-auth-token';
}


// Add a new account
app.post('/register', function (req, res) {
 var user = [req.body];
 con.query("INSERT INTO users SET ? ", user, function (error, results) {
     if (error) throw error;
     return res.send({error: false, user: results, message: 'New user has been created successfully.'});
 });
});


//loan calculation
app.use(express.json());


function calculateTotalCost(amount, interest_rate, period) {
 const totalInterest = amount * interest_rate * period;
 return totalInterest;
}
function formatDate(date) {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, "0");
 const day = String(date.getDate()).padStart(2, "0");
 return `${year}-${month}-${day}`;
}




function calculateInstalments(amount, interest_rate, period, start_date, frequency) {
 let instalments = [];
 let principal = amount;


 for (let i = 0; i < period; i++) {
   let interestAmount = 0;


   if (frequency === "annually") {
     interestAmount = principal * interest_rate;
   } else if (frequency === "quarterly") {
     interestAmount = (principal * interest_rate) / 4;
   } else if (frequency === "monthly") {
     interestAmount = (principal * interest_rate) / 12;
   } else if (frequency === "every6months") {
     interestAmount = (principal * interest_rate) / 2;
   }


   let totalAmount = principal + interestAmount;


   instalments.push({
     "Payment Date": formatDate(start_date),
     "Instalment Amount": totalAmount.toFixed(2),
   });


   if (frequency === "annually") {
     start_date.setFullYear(start_date.getFullYear() + 1);
   } else if (frequency === "quarterly") {
     start_date.setMonth(start_date.getMonth() + 3);
   } else if (frequency === "monthly") {
     start_date.setMonth(start_date.getMonth() + 1);
   } else if (frequency === "every6months") {
     start_date.setMonth(start_date.getMonth() + 6);
   }


   principal -= amount / period;
 }


 return instalments;
}


app.post('/calculate-payment', (req, res) => {
 const { amount, frequency, period, startDate, interestType, selectedBank } = req.body;


 let interestRate = 0;
 let processingFees = 0;
 let exciseDuty = 0;


 if (selectedBank === "bankA") {
   if (interestType === "flat_rate") {
     interestRate = 0.20;
   } else if (interestType === "reducing_balance") {
     interestRate = 0.22;
   }
   processingFees = 0.03 * amount;
   exciseDuty = 0.20 * processingFees;
 } else if (selectedBank === "bankB") {
   if (interestType === "flat_rate") {
     interestRate = 0.18;
   } else if (interestType === "reducing_balance") {
     interestRate = 0.25;
   }
   processingFees = 0.03 * amount;
   exciseDuty = 0.20 * processingFees;
 }


 const legalFees = 10000;
 const totalCharges = processingFees + exciseDuty + legalFees;
 const totalCost = calculateTotalCost(amount, interestRate, period);
 const takeHomeAmount = amount - totalCharges;


 const instalments = calculateInstalments(amount, interestRate, period, new Date(startDate), frequency);


 res.json({
   monthlyPayment: instalments[0]["Instalment Amount"],
   totalCharges,
   totalCost,
   takeHomeAmount,
   instalments,
 });
});




app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
});
