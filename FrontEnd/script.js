const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");
const modaleLink = document.querySelector(".modale");
const modaleOverlay = document.querySelector(".modal-overlay");
const modaleClose = document.querySelector(".modal-close");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalAddView = document.querySelector(".modal-add-view");
const modalAddPhotoBtn = document.querySelector(".modal-add-photo");
const modalBack = document.querySelector(".modal-back");
const modalCategorySelect = document.querySelector("#categorie");
const modalAddBtn = document.querySelector(".modal-add-btn");
const modalTitleInput = document.querySelector("#titre");
const modalPhotoInput = document.querySelector("#photo");
const modalAddForm = document.querySelector(".modal-add-form");
const modalPhotoPreview = document.querySelector(".modal-photo-preview");
let currentPhotoUrl = null;
const modalUpload = document.querySelector(".modal-upload");
//je créer une variable projects pour pouvoir l'utiliser dans mes fonctions
let projects;

//Je créer une fonction pour afficher l'aperçu de la photo séléctionné lors d'un ajout de projet dans la modale.
function displayPhotoPreview () {
    //Je créer une constante pour récupéré le fichier choisit par l'utilisateur
    const selectedPhoto = modalPhotoInput.files[0];
    //Si selectedPhoto est différent de undefined alors éxécuté ses instructions.
    if (selectedPhoto !== undefined) {
        //Si selectedPhoto est !== de undefined alors je refait une condition if pour voir si currentPhotoUrl !== null
        //Pour libérer l'ancienne URL avant d'en créer une nouvelle.
        if (currentPhotoUrl !== null) {
            //pour libéré l'URL deja existante j'utilise URL.revokeObjectURL avec comme paramètre ici currentPhotoUrl
            URL.revokeObjectURL(currentPhotoUrl);
        }
        //Je demande au navigateur de créer une URL locale temporaire qui permet d'accéder au fichier selectionné.
        //Pour faire ça j'utilise URL.createObjectURL() avec comme parametre selectedPhoto
        const photoUrl = URL.createObjectURL(selectedPhoto);
        //j'associe la src de la balise img a l'URL créer juste en dessus.
        modalPhotoPreview.src = photoUrl;
        //Je modifie le CSS pour passer le display en block
        modalPhotoPreview.style.display = "block";
        //j'ajoute la class afterPreview a la suite de la class modal-upload, pour la masqué quand il y a l'aperçu de l'image
        modalUpload.classList.add("afterPreview");
        currentPhotoUrl = photoUrl;
    }
}

//Je créer une fonction pour vidé le formulaire de la modale une fois celui ci validé
function resetModalForm () {
    //On utilise .reset() pour rétablir les valeurs initial d'un formulaire en HTML
    modalAddForm.reset();
    //Et on remet disabled sur le bouton pour le désactivé
    modalAddBtn.disabled = true;
    //Et on cache la photo en remettant none sur display sur la class css de la preview
    modalPhotoPreview.style.display = "none";
    //Et je retire l'url de la src de l'image pour l'enlever et pas seulement la "cacher"
    modalPhotoPreview.removeAttribute("src");
    //J'enleve la class afterPreview lors du "reset" pour re afficher les éléments i p et label
    modalUpload.classList.remove("afterPreview");
    //J'ajoute une condition if si currentPhotoUrl est !== de null
    if (currentPhotoUrl !== null) {
        URL.revokeObjectURL(currentPhotoUrl);
        //Je remet l'url de la photo égal a null
        currentPhotoUrl = null;
    }
}

//Je créer une fonction pour m'assurer que le formulaire de la modale est bien remplis pour passer le bouton Valider fonctionnel.
function checkModalForm () {
    //Je récupére la valeur du champ de Titre
    //Vu qu'il s'agit d'une chaine de caracteres, .trim() sert a supprimé les espaces du début et de fin. Ca évite qu'un utilisateur rentre seulement des espaces.
    const titleFilled = modalTitleInput.value.trim() !== "";
    const categoryFilled = modalCategorySelect.value !== "";
    //Je vérifie le format de la photo avec .files
    const selectedPhoto = modalPhotoInput.files[0];
    //on démarre avec ValidPhoto qui vaut false, puis si la condition If est correct, ValidPhoto passe en true
    let validPhoto = false;
    if (selectedPhoto) {
        //Si la photo est au format png
        const isPng = selectedPhoto.type === "image/png";
        //Si la photo est au format jpeg
        const isJpeg = selectedPhoto.type === "image/jpeg";
        //Si l'image est au format png OU jpeg alors c'est true
        const validFormat = isPng || isJpeg;
        //Ensuite on vérifie la taille de l'image
        //On commence par récupéré la taille de l'image avec .size
        const photoSize = selectedPhoto.size;
        //On indique ensuite la taille maximum accepté pour une image
        //Ici on veut 4mo maximum, on fait donc le calcul 4 x 1024 x 1024 = 4 194 304 octets
        const maxPhotoSize = 4 * 1024 * 1024;
        //On vérifie si la taille est bien inférieur ou égal a celle maximum autorisée
        const validSize = photoSize <= maxPhotoSize;
        //Enfin on vérifie que la taille et le format de l'image sont correct
        validPhoto = validFormat && validSize;
    }
    //On vérifie si les 3 conditions sont valide avec &&
    const formFilled = titleFilled && categoryFilled && validPhoto;
    modalAddBtn.disabled = !formFilled;
}

//J'ajoute des écouteurs sur tout les éléments du form : titre, catégorie, photo
//a chaque fois qu'un champ est remplit on execute checkModalForm pour voir si tout les champs sont remplis pour activer le bouton
modalTitleInput.addEventListener("input", function () {
    checkModalForm()
})

modalCategorySelect.addEventListener("change", function () {
    checkModalForm()
})

modalPhotoInput.addEventListener("change", function () {
    checkModalForm()
    displayPhotoPreview()
})

//Je créer une fonction pour appeller mes catégories depuis l'api pour les mettre dans mon menu déroulant de la modale
function displayModalCategories(categories) {
    modalCategorySelect.innerHTML = "";
    //Sert a avoir une option initial qui est vide dans la champ catégorie
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    //Permet de cacher l'option vide dans la liste déroulante des options
    emptyOption.disabled = true;
    emptyOption.hidden = true;
    //Permet a l'option vide d'être séléctionné immédiatement au chargement de la page
    emptyOption.selected = true;
    //Permet a l'option vide d'être séléctionné par defaut lors d'un reset du formulaire aprés validation.
    emptyOption.defaultSelected = true;
    modalCategorySelect.appendChild(emptyOption);

    categories.forEach(function (categorie) {
        const categoryOption = document.createElement("option");
        categoryOption.textContent = categorie.name;
        categoryOption.value = categorie.id;
        modalCategorySelect.appendChild(categoryOption);
    })
}

//Je créer l'écoute sur la fleche de retour dans la modal pour revenir a la premiere page
modalBack.addEventListener("click", function () {
    modalGalleryView.style.display = "block";
    modalAddView.style.display = "none";
})

//Je créer l'écoute du click sur le bouton ajouter une photo
modalAddPhotoBtn.addEventListener("click", function () {
    modalGalleryView.style.display = "none";
    modalAddView.style.display = "block";
})

//Je créer l'écoute du click sur le bouton modifier pour ouvrir la modale
modaleLink.addEventListener("click", function (event) {
    event.preventDefault();
    modaleOverlay.style.display = "flex";
    modalGalleryView.style.display = "block";
    modalAddView.style.display = "none";
})

//Je créer l'écoute du click sur l'overlay (en dehors de la modale) pour fermer la modale
modaleOverlay.addEventListener("click", function (event) {
    if (event.target === modaleOverlay ) {
        modaleOverlay.style.display = "none";
        resetModalForm();
    }
})

//Je créer l'écoute du clique sur la croix de la modale pour fermer la modale
modaleClose.addEventListener("click", function (event) {
    event.preventDefault();
    modaleOverlay.style.display = "none";
    resetModalForm();
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

    //j'appelle la fonction des catégories de la modale et je lui transmet le tableau des catégories.
    displayModalCategories(categories);

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