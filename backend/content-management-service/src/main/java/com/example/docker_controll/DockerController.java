package com.example.docker_controll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
class DockerController {

    @GetMapping("docker")
    public String dockerDemo() {
        return "docker demo";
    }
}
