package com.allforest01.VideoCall.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;

@Controller
public class WebSocketController {

    ArrayList<String> users = new ArrayList<String>();

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;


//    @RequestMapping(value = "/",method =  RequestMethod.GET)
//    public String Index(){
//        return "index";
//    }

    @MessageMapping("/testServer")
    @SendTo("/topic/testServer")
    public String testServer(String Test){
        System.out.println("Testing Server");
        return Test;
    }

    @MessageMapping("/addUser")
    public void addUser(String user){
        System.out.println("Adding User");
        users.add(user);
        for (String u :users) {
            System.out.println(u);
        }
        System.out.println("User Added Successfully");
    }

    @MessageMapping("/call")
    public void Call(String call){
        JSONObject jsonObject = new JSONObject(call);
        System.out.println("Calling to: "+jsonObject.get("callTo")+" Call from "+jsonObject.get("callFrom"));
        System.out.println("Calling to class: "+jsonObject.get("callTo").getClass()+" Call from class "+jsonObject.get("callFrom").getClass());
        simpMessagingTemplate.convertAndSendToUser(jsonObject.getString("callTo"),"/topic/call",jsonObject.get("callFrom"));
    }

    @MessageMapping("/offer")
    public void Offer(String offer){

        System.out.println("Offer Came");
        JSONObject jsonObject = new JSONObject(offer);
        System.out.println(jsonObject.get("offer"));
        System.out.println(jsonObject.get("toUser"));
        System.out.println(jsonObject.get("fromUser"));
        simpMessagingTemplate.convertAndSendToUser(jsonObject.getString("toUser"),"/topic/offer",offer);
        System.out.println("Offer Sent");
    }

    @MessageMapping("/answer")
    public void Answer(String answer){
        System.out.println("Answer came");
        System.out.println(answer);
        JSONObject jsonObject = new JSONObject(answer);
        System.out.println(jsonObject.get("toUser"));
        System.out.println(jsonObject.get("fromUser"));
        System.out.println(jsonObject.get("answer"));
        simpMessagingTemplate.convertAndSendToUser(jsonObject.getString("toUser"),"/topic/answer",answer);
        System.out.println("Answer Sent");
    }

    @MessageMapping("/candidate")
    public void Candidate(String candidate){
        System.out.println("Candidate came");
        JSONObject jsonObject = new JSONObject(candidate);
        System.out.println(jsonObject.get("toUser"));
        System.out.println(jsonObject.get("fromUser"));
        System.out.println(jsonObject.get("candidate"));
        simpMessagingTemplate.convertAndSendToUser(jsonObject.getString("toUser"),"/topic/candidate",candidate);
        System.out.println("Candidate Sent");
    }

}
