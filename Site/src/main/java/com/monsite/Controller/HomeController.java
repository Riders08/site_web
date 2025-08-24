package com.monsite.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String Home(){
        return "index";
    } 

    @GetMapping("/informations")
    public String Informations(){
        return "informations";
    }

    @GetMapping("/documents")
    public String Documents(){
        return "documents";
    }

    @GetMapping("/projets")
    public String Projets(){
        return "projets";
    }
}
