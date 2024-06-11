package com.allforest01.VideoCall.service;

import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.Queue;

@Service
public class VideoCallService {

    private Queue<String> availableCSRs = new LinkedList<>();

    public void registerCSR(String csrID) {
        availableCSRs.add(csrID);
    }

    public String getNextAvailableCSR() {
        return availableCSRs.poll();
    }
}
