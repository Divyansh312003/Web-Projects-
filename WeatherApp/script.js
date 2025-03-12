const usertab= document.querySelector("[data-userWeather]");
const searchtab= document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

//initially userTab open rahega 
let currentTab= usertab;
const APIKey="46c28ada24a07764eeef52e57ebdb838";
currentTab.classList.add("current-tab");
getfromSessionStorage();






function switchTab(clickedtab){
    if(clickedtab!=currentTab){
        //remove background color from the tab and shift it to the other tab
        currentTab.classList.remove("current-tab");
        currentTab=clickedtab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //means that we have clicked on search weather tab
            userInfoContainer.classList.remove("active");
            //removing the grant access UI
            grantAccessContainer.classList.remove("active");
            //adding the search form UI
            searchForm.classList.add("active");
        }
        else{
            //ab your weather tab pe click kiya hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab hum your weather section me hai so usko display krna hai aur local me coordinates save kiye honge uske basis pr result display krna hai 
            getfromSessionStorage();

        }
    }
}
//adding event listener on both the tabs to switch the UI
usertab.addEventListener("click",()=>{
    switchTab(usertab);
});
searchtab.addEventListener("click",()=>{
    switchTab(searchtab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//if coordinates are already present in sesssion storage

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}= coordinates;
    //grant access wali screen invisible kr do
    grantAccessContainer.classList.remove("active");
    //loading screen wali visible kr do
    loadingScreen.classList.add("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);
        const data = await response.json();
        //removing loading screen 
        loadingScreen.classList.remove("active");
        //adding user info container
        userInfoContainer.classList.add("active");
        //jo data api call se aaya hai usko UI pe display krne ke liye
        renderWeatherInfo(data);
    }
    catch(err){
    loadingScreen.classList.remove("active");
    }
}

//render function
function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDes]"); // Fixed typo
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]"); // Added temp variable
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp - 273} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

//adding event listener on the button such that when the button is clicked the location is fetched from api and stored in session storage
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


function showPosition(position){  
    //fetched the latitude and longitude of the location
     const userCoordinates= {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
     }
     //then the location is stored in the local memory 
      sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
      // to render it on the UI
      fetchUserWeatherInfo(userCoordinates);
        
    
    }


function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
           alert("No geololcation found");
        }
    }
    //added event listener to get the location


//now addding event listener on the search button in the form div
let searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value ==="") 
    return;
    else
    fetchSearchWeatherInfo(searchInput.value);

});


 async function  fetchSearchWeatherInfo(city){
    //adds loader screen and removes the current weather screen
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    //calls the API
    try{
        const response=  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert("error occcured",err);
    }
  

 }
