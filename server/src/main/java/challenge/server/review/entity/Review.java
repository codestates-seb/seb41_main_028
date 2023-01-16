package challenge.server.review.entity;

import challenge.server.audit.BaseTimeEntity;
import challenge.server.challenge.entity.Challenge;
import challenge.server.habit.entity.Habit;
import challenge.server.user.entity.User;
import lombok.*;

import javax.persistence.*;
import java.util.Optional;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Review extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private int score;
    private String body;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "HABIT_ID")
    private Habit habit;

    private User user;

    public void changeReview(Review review) {
        Optional.ofNullable(review.getBody())
                .ifPresent(changeBody -> this.body = changeBody);
        Optional.ofNullable(review.getScore())
                .ifPresent(changeScore -> this.score = changeScore);
    }
}
