package com.allforest01.UserManagement.repository;


import com.allforest01.UserManagement.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users, Integer> {

    Optional<Users> findByEmail(String email);
}
