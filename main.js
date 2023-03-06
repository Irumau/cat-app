
const img = document.querySelectorAll('#img');
const buttonChange = document.getElementById('ButtonChange');
const favoriteButton = document.querySelectorAll('#favoriteButton');
const btnUploadPictureCat = document.getElementById('uploadPictureCat');
const spanError = document.getElementById('errorCat');
const API_RANDOM = 'https://api.thecatapi.com/v1/images/search?&limit=8';
const API_FAVORITE = 'https://api.thecatapi.com/v1/favourites';
const API_FAVORITE_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_KEY = 'live_J9shTIRvFMADGXyAFerDIn1Wxg61dCPJ7GME27JrhWgoIaYaGwUyk6IKYmSojjxS';



async function FetchData(URL) {
    const response = await fetch(URL);
    if (response.status !== 200) {
        spanError.innerHTML = "Se ha producido un error: " + response.status
    } else {
        const data = await response.json();
        return data;
    }
};

const getRandomDataCat = async () => {
    const dataCat = await FetchData(API_RANDOM);
    const imgArray = [...img];
    const favoriteButtonArray = [...favoriteButton];


    imgArray.forEach((cat,index) => {
        cat.src = dataCat[index].url;
    })

    favoriteButtonArray.forEach((cat,index) =>{
        cat.onclick = () => saveFavoriteDataCat(dataCat[index].id);
    })    
};

buttonChange.addEventListener('click', () => {
    getRandomDataCat();
});

const saveFavoriteDataCat = async (id) => {
    const response = await fetch(API_FAVORITE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });
    const data = await response.json();
    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        loadFavoriteDataCats();
    }
};
async function loadFavoriteDataCats() {
    const response = await fetch(API_FAVORITE, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    });
    const data = await response.json();

    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status
    } else {
        const divContainer = document.getElementById('favoriteCatsContainer');
        divContainer.innerHTML = "";
        data.map((cat) => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Remove from favorite')

            article.classList.add('favorite-cat__article')
            btn.classList.add('favorite-cat__button-favorite');
            img.classList.add('favorite-cat__image');

            img.src = cat.image.url;

            btn.appendChild(btnText);
            article.appendChild(img)
            article.appendChild(btn)
            divContainer.appendChild(article);
        })
    }


    const removeBtn = document.querySelectorAll('.favorite-cat__button-favorite');
    const removeBtnArray = [...removeBtn];
    removeBtnArray.map((btnRemove, i) => {
        btnRemove.addEventListener('click', () => {
            deleteDataCats(data[i].id)
        })
    })
};
async function deleteDataCats(id) {
    const response = await fetch(API_FAVORITE_DELETE(id), {
        method: "DELETE",
        headers: {
            'X-API-KEY': API_KEY,
        }
    });
    const data = await response.json();

    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        loadFavoriteDataCats();
    }
};
async function uploadPictureCat() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    const response = await fetch(API_UPLOAD, {
        method: 'POST',
        headers: {
            'X-API-KEY': API_KEY,
        },
        body: formData,
    })
    const data = await response.json();
    if (response.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${response.status} ${data.message}`
    }
    else {
        saveFavoriteDataCat(data.id)
    }
};

btnUploadPictureCat.addEventListener('click', () => {
    uploadPictureCat();
    imgPreview.src = ''
    imgPreview.classList.remove('img-preview');
});

const selectFile = document.getElementById('selectFile');
const imgPreview = document.getElementById('preview')

selectFile.addEventListener('change',()=>{

    const files = selectFile.files;

    if(!files || !files.length){
        imgPreview.src = '';
        return;
    }
    const firstFile = files[0];
    const objectURL = URL.createObjectURL(firstFile);
    imgPreview.classList.add('img-preview');
    imgPreview.src = objectURL;
})

getRandomDataCat();
loadFavoriteDataCats()
