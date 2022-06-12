package com.tkppp.sportresult.web

import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class WebErrorController: ErrorController {

    @GetMapping("/error")
    fun redirectRoot(): String = "index.html"

    @Override
    fun getErrorPath(): String = "/error"
}