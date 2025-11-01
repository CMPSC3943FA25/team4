function saveData() {
    const inputValue = document.getElementById('userInput').value;

    localStorage.setItem('userData', inputValue);

    displaySavedData();
}

function displaySavedData() { 
    const saveData = localStorage.getItem('userData');
    const saveDataElement = document.getElementById('saveData');
    if (saveData){
        saveDataElement.textContent = saveData;
    } else {
        saveDataElement.textContent = "no data saved";
    }
}
window.onload = displaySavedData
window.onclose = saveData