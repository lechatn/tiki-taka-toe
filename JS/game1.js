import championsLeague from "../data/championsLeague.json" assert {
  type: "json",
};
import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };
import worldCup from "../data/worldCup.json" assert { type: "json" };


const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
const icon = searchInput.querySelector(".icon");
let linkTag = searchInput.querySelector("a");
let webLink;

const allData = championsLeague.concat(bundesliga, premierLeague, ligue1, serieA, laLiga, worldCup);

let playerArray = [];

for(let j=0; j<allData.length; j++){
    for(let i=0; i<allData[j].players.length; i++){
        if (playerArray.includes(allData[j].players[i].player_name)){
            continue;
        } else {
        playerArray.push(allData[j].players[i].player_name);
        }
    }
}

input.onkeyup = (e)=>{
    let userData = e.target.value;
    let emptyArray = [];
    if(userData){
        emptyArray = playerArray.filter((data)=>{
            return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>'+ data +'</li>';
        });
        searchInput.classList.add("active");
        showSuggestions(emptyArray);
        let allList = resultBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].addEventListener('click', function() {
                input.value = this.innerText;
                searchInput.classList.remove("active");
            });
        }
    } else{
        searchInput.classList.remove("active");
    }
}


function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    resultBox.innerHTML = listData;
}

    