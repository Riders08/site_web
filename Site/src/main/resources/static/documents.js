import { getFileWithExtension, verif_file, checkKeyword, checkFile, checkFileAlreadyExists, 
            checkExtensionFile, all_file, deleteLocalFile, addLocalKeyword,modif_sugg, all_words, getFilenamesWithoutExtension, 
                filename, Connected,
                addLocalFile} from "./typescript.js";
import { addFile, addKeywords, deleteFile} from "./keywords.js";

// PARTI DOCUMENTS
document.addEventListener("DOMContentLoaded", () => {
    // Barre de recherche de document
    const ghost_input = document.getElementById("barre_de_recherche_fantome");
    const input = document.getElementById("barre_de_recherche");
    const suggestion_box = document.getElementById("suggestion_file");

    input.addEventListener("input", (e) =>{
        e.preventDefault();
        const input_value = input.value;
        if(input_value){
            const all_suggestion = all_words().sort((first, second) => first.length - second.length);
            const suggestion = all_suggestion.find(element => element.toLowerCase().startsWith(input_value.toLowerCase()) && element.toLowerCase() != input_value.toLowerCase());
            if(suggestion && input_value){
                ghost_input.value = modif_sugg(input_value,suggestion);
            }else{
                ghost_input.value = "";
            }
        }else{
            ghost_input.value = "";
        }
    });

    input.addEventListener("keydown", (e) =>{
        if(e.key === "Tab" && ghost_input.value != ""){
            e.preventDefault();
            input.value = ghost_input.value;
            ghost_input.value = "";
        }
    });

    input.addEventListener("input", (e) => {
        const value = e.target.value;
        suggestion_box.innerHTML = "";
        if(!value){
            suggestion_box.style.display = "none";
            return;
        }
        const all_file_suggestion = all_file(value);
        if(all_file_suggestion.length > 0){
            all_file_suggestion.forEach(suggestion =>{
                const div = document.createElement("div");
                div.className = "suggestion_item";
                div.textContent = suggestion;
                div.addEventListener("click", (e) =>{
                    input.value = suggestion;
                    ghost_input.value = "";
                    suggestion_box.style.display = "none";
                    window.location = window.location + "/" + input.value;
                });
                suggestion_box.appendChild(div);
            });
            suggestion_box.style.display = "block";
        } else{
            suggestion_box.style.display = "none";
        }
    });

    document.addEventListener("click", (e) =>{
        if(!e.target.closest(".barre_recherche") && !e.target.closest(".suggestion.file") && !e.target.closest(".suggestion_box")){
            suggestion_box.style.display = "none";
            ghost_input.value = "";
        }
    });

    document.querySelector(".search").addEventListener("click", (e) => {
        e.preventDefault();
        ghost_input.value = "";
        filename.forEach(file =>{
            if(input.value === file){
                suggestion_box.style.display = "none";
                window.location = window.location + "/" + input.value;
            }
        })
    })



    //Constante nécessaire pour les fonctionnalités d'ajout de fichier, mot-clé, et de suppression
    // Pour suppression
    const file_to_delete = document.getElementById("file_to_delete");
    // Pour importation de mot-clé
    const input_file = document.getElementById("file_to_keyword");
    const input_keywords = document.getElementById("ajout_key");
    // Pour importation
    const hiddenFileInput = document.createElement("input");
    const mot_clé = document.getElementById("create_file_keys");


    // Ajouts mots-clés sur fichier 
    document.querySelector(".add_key").addEventListener("click", (e) =>{
        e.preventDefault();
        if(input_file.value === ""){
            Swal.fire({
                icon: "error",
                text: "Aucun fichier n'a été donnée",
                showConfirmButton: false,
                position: "top-end",
                timer: 2500
            });
            return;
        }
        if(input_keywords.value === ""){
            Swal.fire({
                icon: "error",
                text: "Aucun mot-clé n'a été donnée",
                showConfirmButton: false,
                position: "top-end",
                timer: 2500
            });
            return;
        }
        if(verif_file(input_file.value + ".pdf") === false && verif_file(input_file.value + ".odt") === false &&
            verif_file(input_file.value + ".txt") === false && verif_file(input_file.value + ".png") === false &&
            verif_file(input_file.value + ".jpeg") === false && verif_file(input_file.value + ".jpg") === false){
            Swal.fire({
                icon: "error",
                text: "Le fichier n'existe pas dans la base de donnée",
                showConfirmButton: false,
                position: "top-end",
                timer: 2500
            });
            return;
        }
        let extension = ".";
        filename.forEach(element => {
            if(element.split(".")[0] === input_file.value){
                extension += element.split(".")[1];
            }
        })
        if(checkKeyword(input_file.value + extension, input_keywords.value)){
            Swal.fire({
                icon: "error",
                text: "Ce mot-clé existe déjà pour ce fichier.",
                showConfirmButton: false,
                position: "top-end",
                timer: 2500
            })
        } else{
            addLocalKeyword(input_file.value + extension, input_keywords.value);
            addKeywords(input_file.value + extension, input_keywords.value);
            input_file.value = "";
            input_keywords.value = "";
            Swal.fire({
                icon: "success",
                text: "L'ajout du mot-clé a bien été pris en compte.",
                showConfirmButton: true
            });
            return;
        }
    })

    // Aide pour selectionner un fichier pour rajout mot-clé ou delete de fichier
    document.querySelectorAll(".files_view").forEach(element =>{
        element.addEventListener("click", (e) =>{
            e.preventDefault();
            Swal.fire({
                title: "Liste des fichiers",
                html: `
                    <div class="list_file_info"></div>
                `,
                showConfirmButton: false,
                didOpen: async () => {
                    const div = document.querySelector(".list_file_info");
                    if(div){
                        const filenames = getFilenamesWithoutExtension(filename);
                        filenames.forEach(file => {
                            const a = document.createElement("a");
                            const li = document.createElement("li");
                            li.textContent = file;
                            li.classList.add("file_element_exist");
                            a.appendChild(li); 
                            div.appendChild(a);
                        });
                        div.addEventListener("click", (e) =>{
                            if(e.target.classList.contains("file_element_exist")){
                                e.preventDefault();
                                if(element.classList.contains("file_view_delete")){
                                    file_to_delete.value = e.target.textContent;
                                }else if(element.classList.contains("file_view_keywords")){
                                    input_file.value = e.target.textContent;
                                }else{
                                    console.error("Il y a une erreur de selection de fichier associer à l'input en question");
                                }
                                Swal.close();
                            }
                        })
                    } 
                }
            }); 
        });
    })

    // Redirection warning connexion pour ajout ou suppression de fichier
    document.querySelectorAll(".warning_connection").forEach(element =>{
        element.addEventListener("click", (e) =>{
            e.preventDefault();
            Swal.fire({
                icon: "info",
                title: "Comment se connecter ?",
                confirmButton: true,
                text: "Pour vous connecter il suffit de cliquer sur le bouton 'Admin' situé en haut de la page",
            })
        })
    }) 
    // Ajout de fichier dans la base de données

    hiddenFileInput.type = "file";
    hiddenFileInput.accept = ".pdf,.odt,.txt,.png,.jpg,.jpeg";
    hiddenFileInput.style.display = "none";
    document.body.appendChild(hiddenFileInput);

    document.querySelector(".upload").addEventListener("click", (e) =>{
        if(Connected === true){
            e.preventDefault();
            hiddenFileInput.value = "";
            hiddenFileInput.click();
        }else{
            Swal.fire({
                icon: "error",
                text: "Vous n'êtes pas connecté, vous n'avez donc pas les droits !",
                showConfirmButton: true,
                confirmButtonText: "OK"
            });
        }
    })


    hiddenFileInput.addEventListener("change", (e) => {
        const file = hiddenFileInput.files[0];
        if(!file){
            Swal.fire({
                icon: "error",
                showConfirmButton: false,
                position: "top-end",
                text: "Aucun fichier n'a été selectionnée"
            })
            return;
        }
        if(checkExtensionFile(file) === false){
            Swal.fire({
                icon: "warning",
                showConfirmButton: false,
                position: "top-end",
                text: "Le fichier selectionné n'a pas une extension valide"
            });
            return;
        }
        if(checkFileAlreadyExists(file)){
            Swal.fire({
                icon: "warning",
                showConfirmButton: false,
                position: "top-end",
                text: "Le fichier selectionné existe déjà dans la base de donnée"
            });
            return;
        }
        const keywordsText = mot_clé.value.trim();
        let keywords = [];
        if(keywordsText){
            keywords = keywordsText.split(",").map(keys => keys.trim());
            addFile(file, file.name, keywords);
            addLocalFile(file.name);
            addLocalKeyword(file.name, keywords);
            Swal.fire({
                icon: "success",
                text: "Importation réussi avec succès",
                position: "top-end",
                showConfirmButton: false
            });
            return;
        }else{
            Swal.fire({
                icon: "info",
                showConfirmButton:false,
                html: `
                    <a>Attention aucun mot-clé n'a été écrit, souhaitez-vous tout de même faire l'importation ?<a/>
                    <div class="yes_no_box">
                        <a class="yes_import"><i class="fa-solid fa-circle-check button-fire-import"></i></a>
                        <a class="no_import"><i class="fa-solid fa-circle-xmark button-fire-import"></i></a>
                    </div>
                `,
                didOpen: async () =>{
                    document.querySelector(".yes_import").addEventListener("click", (e) =>{
                        Swal.close();
                        if (keywordsText) {
                            keywords = keywordsText.split(",").map(k => k.trim());
                        } else {
                            keywords = [];
                        }
                        addFile(file, file.name, keywords);
                        addLocalFile(file.name);
                        Swal.fire({
                            icon: "success",
                            text: "Importation réussi avec succès",
                            position: "top-end",
                            showConfirmButton: false
                        });
                        return;
                    })
                    document.querySelector(".no_import").addEventListener("click", (e) => {
                        Swal.close();
                    })
                }
            });
            return;
        }
        hiddenFileInput.value = "";
    });

    // Suppression de fichier dans la base de données 
    document.querySelector(".delete_file").addEventListener("click", (e) =>{
        if(Connected === false){
            Swal.fire({
                icon: "error",
                text: "Vous n'êtes pas connecté, vous n'avez donc pas les droits !",
                showConfirmButton: true,
                confirmButtonText: "OK"
            });
            return;
        }else{
            if(file_to_delete){
                const delete_file = getFileWithExtension(file_to_delete.value);
                if(checkFile(delete_file)){
                    Swal.fire({
                        icon: "warning",
                        showConfirmButton:false,
                        html: `
                            <a>Attention une fois supprimé vous ne pourrez plus visionner ce fichier, souhaitez-vous tout de même le supprimer ?<a/>
                            <div class="yes_no_box">
                                <a class="yes_delete"><i class="fa-solid fa-circle-check button-fire-import"></i></a>
                                <a class="no_delete"><i class="fa-solid fa-circle-xmark button-fire-import"></i></a>
                            </div>
                        `,
                        didOpen: async () =>{
                            document.querySelector(".yes_delete").addEventListener("click", (e) =>{
                                Swal.close();
                                deleteLocalFile(delete_file);
                                file_to_delete.value = "";
                                deleteFile(delete_file);
                                Swal.fire({
                                    icon: "success",
                                    text: "Suppression effectué avec succès",
                                    position: "top-end",
                                    showConfirmButton: false
                                });
                                return;
                            })
                            document.querySelector(".no_delete").addEventListener("click", (e) => {
                                file_to_delete.value ="";
                                Swal.close();
                            })
                        }
                    });
                    return;
                }else{
                    Swal.fire({
                        icon: "error",
                        showConfirmButton: false,
                        position: "top-end",
                        text: "Le fichier n'est pas compris dans la base de donnée"
                    });
                    return;
                }
            }else{
                Swal.fire({
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    text: "Vous n'avez choisi aucun fichier à supprimer."
                });
                return;
            }
        }
    })

    document.querySelector(".fa-question").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "question",
            showConfirmButton: false,
            position: "bottom-start",
            html:
                `
                <div class="help_keywords">
                    <p><strong> Exemple de mot-clé:</strong></p>
                    <ul class="help_keywords_point">
                        <li>Le terme "mot" est un mot-clé <i class="fa-solid fa-check"></i></li>
                        <li>Le terme "mot clé" n'est pas un mot-clé <i class="fa-solid fa-xmark"></i></li>
                        <li>Le terme "mot-clé" est un mot-clé <i class="fa-solid fa-check"></i></li>
                    </ul>
                </div>
                `
        })
    })
})
