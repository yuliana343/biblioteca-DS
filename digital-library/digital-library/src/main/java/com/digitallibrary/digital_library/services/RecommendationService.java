package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.response.BookResponse;
import java.util.List;

public interface RecommendationService {
    List<BookResponse> getRecommendationsForUser(Long userId);
    List<BookResponse> getPopularRecommendations();
    List<BookResponse> getSimilarBooks(Long bookId);
    List<BookResponse> getNewArrivals();
    void generateRecommendationsForUser(Long userId);
    void updateRecommendations();
    void clearUserRecommendations(Long userId);
}