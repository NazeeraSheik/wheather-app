/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '8c1eb702d7e63bd7f86d1e3805bd70fe'; // Personal API Key for OpenWeatherMap API

// Create a new date instance dynamically with JS
let d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let newDate = d.getDate() + '.' + months[d.getMonth()] + '.' + d.getFullYear();

const userInfo = document.getElementById('userInfo');

// Event listener to add function to existing HTML DOM element
const Btn = document.getElementById('generate');
Btn.addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
    e.preventDefault();

    //get user input
    const zipCode = document.getElementById('zip').value;
    const userFeeling = document.getElementById('feelings').value;

    if (zipCode !== '' && userFeeling!='') {
        const url=`${baseUrl}?q=${zipCode}&appid=${apiKey}`
        fetchWheather(url)
            .then(function(data) {
                console.log(data)
                // add data to POST request
                postData('/projectData', { 
                    temp: convertKtoC(data.main.temp), 
                    date: newDate,
                    userFeeling: userFeeling,
                    humidity:data.main.humidity,
                    sea_level:data.main.sea_level,
                    pressure:data.main.pressure,
        
                 });
            }).then(function() {
                // call updateUI to update browser content
                updateUI()
            }).catch(function(error) {
                console.log(error);
                alert('You have entered an invalid zip Code. Try again');

            });
        userInfo.reset(); //this will clears the form everytime
    } else {
       alert("Fill the required Values")
    }


}

/* Function to GET Web API Data*/
const fetchWheather = async(url) => {
    // res equals to the result of fetch function
    const fetchedData = await fetch(url);
    try {
        // data equals to the result of fetch function
        const data = await fetchedData.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async(url = '', data = {}) => {
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            userFeeling: data.userFeeling,
            humidity:data.humidity,
            sea_level:data.sea_level,
            pressure:data.pressure,
        })
    });

    try {
        const postData = await response.json();
        return postData;
    } catch (error) {
        console.log(error);
    }
};

const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const finalData = await request.json();
        console.log(finalData);
        // update new entry values
        if (finalData.date !== undefined && finalData.temp !== undefined || finalData.userFeeling !== undefined && finalData.humidity!==undefined) {
            document.getElementById('date').innerHTML = "Date:"+finalData.date;
            document.getElementById('temp').innerHTML = "Temperature:"+finalData.temp + ' degree C';
            document.getElementById('content').innerHTML ="User Feeling:"+ finalData.userFeeling;
            document.getElementById('humidity').innerHTML="Humidity is"+" "+finalData.humidity;
            document.getElementById('sea_level').innerHTML="Sea level is"+" "+finalData.sea_level;
            document.getElementById('pressure').innerHTML="Pressure is"+" "+finalData.pressure;
        }
    } catch (error) {
        console.log('error', error);
    }
};

// helper function to convert temperature from Kelvin to Celsius
function convertKtoC(kelvinTemp) {
    if (kelvinTemp < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        return (kelvinTemp - 273.15).toFixed(2);
    }
}