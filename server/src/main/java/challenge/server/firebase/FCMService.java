package challenge.server.firebase;

import challenge.server.user.entity.User;
import challenge.server.user.service.UserService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FCMService {
    private final UserService userService;
    private final NoticeService noticeService;

    @Async  // 비동기로 동작하도록 설정
    public void sendNotification(User user, String title, String body) {
        if (user.getFcmToken() == null) return;
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setNotification(notification)
                .setToken(user.getFcmToken())
                .putData("time", LocalDateTime.now().toString())
//                .putData("route", route)
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);

            // 발송한 알림을 DB에 저장
            Notice notice = Notice.builder()
                    .user(user)
                    .content(body)
//                    .route(route)
                    .state(1)
                    .title(title)
                    .build();

            noticeService.save(notice);
        } catch (FirebaseMessagingException e) {
            log.error(user.getEmail() + ": cannot send to member push message. error info: {}", e.getMessage());
        }
    }

    /**
     * Controller에서 호출할 메서드
     * User Entity를 가져와 User에게 알림을 보낸다.
     * 트랜잭션 내부에서 동작하여 User의 FCM 토큰으로 알림을 보낸다.
     */
    @Async
    @Scheduled(cron = "${cron.cron2}")
    public void sendMotivationNotice() {
        List<User> users = userService.findAllByFcmTokenNotNull();

        for (User user : users) {
            sendNotification(user,
                    "motivation title",
                    "motivatkon body");
        }
    }

    @Async
    public void sendReviewNotice(User user, String body) {
        sendNotification(user,
                "review title",
                body);
    }
}