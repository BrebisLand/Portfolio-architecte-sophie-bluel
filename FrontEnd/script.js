const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");
const modaleLink = document.querySelector(".modale");
const modaleOverlay = document.querySelector(".modal-overlay");
const modaleClose = document.querySelector(".modal-close");
//je créer une variable projects pour pouvoir l'utiliser dans mes fonctions
let projects;

//Je créer l'écoute du click sur le bouton modifier pour ouvrir la modale
modaleLink.addEventListener("click", function (event) {
    event.preventDefault();
    modaleOverlay.style.display = "flex";
})

//Je créer l'écoute du click sur l'overlay (en dehors de la modale) pour fermer la modale
modaleOverlay.addEventListener("click", function (event) {
    if (event.target === modaleOverlay ) {
        modaleOverlay.style.display = "none";
    }
})

//Je créer l'écoute du clique sur la croix de la modale pour fermer la modale
modaleClose.addEventListener("click", function (event) {
    event.preventDefault();
    modaleOverlay.style.display = "none";
})

//Je créer la fonction pour la gallery de la modal
function displayModalProjects(projects) {
    modalGallery.innerHTML = "";
    //J'utilise forEach pour récupéré chaque élément du tableau projects
    projects.forEach(function (project) {
        const modalFigure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        modalGallery.appendChild(modalFigure);
        modalFigure.appendChild(img);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("modal-delete-btn");
        deleteButton.setAttribute("aria-label", "supprimer le projet");
        deleteButton.setAttribute("type", "button");

        const trashIcone = document.createElement("i");
        trashIcone.classList.add("fa-solid", "fa-trash-can");
        modalFigure.appendChild(deleteButton);
        deleteButton.appendChild(trashIcone);
    })
}

//Je créer la fonction init pour éviter que les boutons de filtres soit créer avant que le tableau projects soit disponible
async function init() {
    //j'exécute la fonction getProjects et j'attend qu'elle soit terminé
    await getProjects();
    //Ensuite j'exécute la fonction getCategories et j'attend qu'elle soit terminé
    await getCategories();
}
init();

async function getProjects() {
    //je récupère les projets a partir de l'api
    const reponse = await fetch("http://localhost:5678/api/works");
    //je convertit le résultat de la requête de l'api en json
    projects = await reponse.json();
    //je fais appel a ma fonction displayProject pour afficher les projets de mon tableau contenu dans la variable projects
    displayProjects(projects);
    displayModalProjects(projects);

    //Faire en sorte que sur login.html, le lien contact amène bien a la section contact de index.html aprés avoir charger les images.
    //Je selectionne toutes les images
    const images = document.querySelectorAll(".gallery img");
    //Je créer un tableau qui contient les éléments HTML <img> de toute ces images a partir de la NodeList renvoyer avec la constante images
    const tableauImages = Array.from(images);
    //utilisation de .map pour éxécuter .decode sur toute les images
    //function(image) à chaque passage, (image) représente une image du tableau
    const promesseImages = tableauImages.map(function (image){
        //.decode demande au navigateur de préparé chaque image du tableau pour son affichage et renvoie une promesse pour chaque image
        //return permet a .map() de récupéré ces promesses et de les placer dans le nouveau tableau
        return image.decode()
    })
    //try essaie d'exécuter
    try {
        //J'attend que toute les promesse du tableau promesseImages soit réussis
        await Promise.all(promesseImages)
    } //catch permet d'intercepter une erreur si jamais il y en a une (ici si une image ne charge pas) et de renvoyer un message.
    catch (erreur) {
        console.log("Au moins une image n'a pas pu être chargée")
    }

    if (window.location.hash === "#contact") {
        const contactSection = document.querySelector("#contact")
        //scollIntoView demande au navigateur de défilé jusqu'a cette section #contact
        contactSection.scrollIntoView()
    }
}

const filters = document.querySelector(".filters");
async function getCategories () {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    //création du bouton "Tous"
    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    filters.appendChild(buttonAll);
    buttonAll.addEventListener("click", function () {
    //Ajout et suppresion de la classe button-selected lros du clique sur le bouton "Tous"
    const allSelected = document.querySelectorAll(".filters button");
    for(let i = 0; i < allSelected.length; i++){
        const currentAll = allSelected[i];
        currentAll.classList.remove("button-selected");
    }
    buttonAll.classList.add("button-selected");
    document.querySelector(".gallery").innerHTML ="";
    displayProjects(projects);
    })
    //Ajout de classList.add sur le bouotn "tous" pour que el bouton prenne la classe button-selected par défaut lors de l'ouverture de la page
    buttonAll.classList.add("button-selected");

    for(let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const button = document.createElement("button");
        button.textContent = category.name

        filters.appendChild(button);
        //J'ajoute un EventListener pour "écouter" chaque click sur les boutons
        button.addEventListener("click", function () {
            //je selectionne tout les boutons situé dans la classe .filters button
            const allButtons = document.querySelectorAll(".filters button")
            //je fais une boucle pour parcourir chaque bouton et leur enlever la class "button-selected"
            for(let i = 0; i < allButtons.length; i++) {
                const currentButton = allButtons[i];
                //On ajoute un .remove sinon tout les boutons resterai avec la classe "button-selected" aprés avoir cliqué dessus.
                currentButton.classList.remove("button-selected");
            }
            //Ajout de la classe css button-selected lorsque qu'un bouton de filtre est sélectionné.
            button.classList.add("button-selected");
            //je re créer un tableau avec .filter a partir de mon tableau projects de base, avec uniquement les projets qui respecte la condition ci dessous
            const filteredProjects = projects.filter(function (project) {
                //Je vérifie si la categoryId du projet appartient a la catégorie du bouton séléctionné
                return project.categoryId === category.id;
            })
            //au click je supprime aussi les éléments contenue dans le HTML sous la class .gallery
            document.querySelector(".gallery").innerHTML ="";
            //ensuite je fais appel a la fonction displayProjects pour afficher les projets contenu dans mon nouveau tableau créer avec la variable filteredProjects
            displayProjects(filteredProjects);
        })
    }

}

function displayProjects(projectList) {
    for(let i = 0; i < projectList.length; i++) {
        const project = projectList[i];
        //je créer mes balise avec .createElement
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl
        img.alt = project.title
        const figcaption = document.createElement("figcaption");
        //.textContent sert a afficher du text provenant de l'api sans l'interpréter comme du HTML
        figcaption.textContent = project.title
        //j'assigne mes éléments dans le DOM avec .appendChild
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}

//Récupération du token obtenue lors de la connexion d'un utilisateur valide
const token = sessionStorage.getItem("token");
const editBanner = document.querySelector(".edit-banner");
const logLink = document.querySelector(".log-link");
const displayFilters = document.querySelector(".filters");
const loginModif = document.querySelector(".modale");
//Si token n'est pas égal a null (donc si on a bien un token qui montre qu'on est connécté) alors :
if (token !== null) {
    //alors afficher le bandeau Mode édition
    editBanner.style.display = "flex";
    //Et changer le texte du lien qui a la class logLink (login) par "logout"
    logLink.textContent = "logout";
    //Et cacher les filtres contenu dans la classe .filters
    displayFilters.style.display = "none";
    //Et afficher le lien "modifier"
    loginModif.style.display = "flex";
} else {
    //sinon si l'utilisateur n'est pas connecté cacher le bandeau Mode édition
    editBanner.style.display = "none";
    //Et afficher login au lieu de logout
    logLink.textContent = "login";
    //et afficher les filtres
    displayFilters.style.display = "flex";
    //Et cacher le lien "modifier"
    loginModif.style.display = "none";
}
//au clique sur logout, on supprime le token de la session pour déconnecter l'utilisateur
logLink.addEventListener("click", function () {
    if (token !== null) {
        sessionStorage.removeItem("token");
    }
})