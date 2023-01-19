package challenge.server.challenge.entity;

import challenge.server.audit.BaseTimeEntity;
import challenge.server.auth.entity.Auth;
import challenge.server.exception.BusinessLogicException;
import challenge.server.exception.ExceptionCode;
import challenge.server.habit.entity.Habit;
import challenge.server.user.entity.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Challenge extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeId;

    private LocalDateTime lastAuthAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "HABIT_ID")
    private Habit habit;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wildcard> wildcards = new ArrayList<>();

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Auth> auths = new ArrayList<>();

    public void changeStatus(Challenge.Status status) {
        this.status = status;
    }

    public void updatePostedAt(LocalDateTime localDateTime) {
        this.lastAuthAt = localDateTime;
    }

    public Boolean successCheck() {
        return this.getCreatedAt().toLocalDate().plusDays(66).equals(this.lastAuthAt.toLocalDate());
    }

    public void todayAuthCheck(LocalDateTime localDateTime) {
        LocalTime startTime = this.habit.getAuthStartTime();
        LocalTime endTime = this.habit.getAuthEndTime();

        LocalDate nowDate = localDateTime.toLocalDate();
        LocalTime nowTime = localDateTime.toLocalTime();

        if (this.lastAuthAt.toLocalDate().equals(nowDate)) {
            throw new BusinessLogicException(ExceptionCode.AUTH_EXISTS);
        }
        if (nowTime.isBefore(startTime) || nowTime.isAfter(endTime)) {
            throw new BusinessLogicException(ExceptionCode.AUTH_NOT_TIME);
        }
    }

    public enum Status {
        CHALLENGE(1),
        SUCCESS(2),
        FAIL(3);

        @Getter
        private final int type;

        Status(int type) {
            this.type = type;
        }
    }
}
