package challenge.server.user.controller;

import challenge.server.challenge.entity.Challenge;
import challenge.server.habit.entity.Habit;
import challenge.server.user.dto.UserDto;
import challenge.server.user.entity.User;
import challenge.server.user.mapper.UserMapper;
import challenge.server.user.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.util.List;

@Api
@RestController
@RequestMapping("/users")
@Validated
@Slf4j
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @ApiOperation(value = "이메일 중복 여부 확인", notes = "true 응답 = 중복되는 이메일 존재 / false 응답 = 중복되는 이메일 없음")
    @GetMapping("/email/{email}/exists")
    public ResponseEntity<Boolean> checkEmailDuplicate(@PathVariable("email") String email) {
//        return new ResponseEntity<>(userService.verifyExistEmail(email), HttpStatus.OK);

        // API 통신용
//        return new ResponseEntity<>(false, HttpStatus.OK);
        return ResponseEntity.ok(false);
    }

    @ApiOperation(value = "회원 닉네임 중복 여부 확인", notes = "true 응답 = 중복되는 닉네임 존재 / false 응답 = 중복되는 닉네임 없음")
    @GetMapping("/username/{username}/exists")
    public ResponseEntity<Boolean> checkUsernameDuplicate(@PathVariable("username") String username) {
//        return new ResponseEntity<>(userService.verifyExistUsername(username), HttpStatus.OK);

        // API 통신용
        return new ResponseEntity<>(false, HttpStatus.OK);
    }

    @ApiOperation(value = "회원 가입", notes = "Sign Up 버튼을 클릭할 경우 회원 가입 요청을 보냅니다.")
    @PostMapping
    public ResponseEntity postUser(@Valid @RequestBody UserDto.Post requestBody) {
        User user = userMapper.userPostDtoToUser(requestBody);
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(userMapper.userToUserSimpleResponseDto(createdUser), HttpStatus.CREATED);

        // API 통신용
//        return new ResponseEntity<>(createSimpleResponseDto(), HttpStatus.CREATED);
    }

    @ApiOperation(value = "회원 정보 수정")
    @PatchMapping("/{user-id}")
    public ResponseEntity patchUser(@PathVariable("user-id") @Positive Long userId,
                                    @Valid @RequestBody UserDto.Patch requestBody) {
//        User updateUser = userService.updateUser(userId);

        // API 통신용
        return new ResponseEntity<>(createPatchResponseDto(), HttpStatus.OK); // todo 회원 정보 수정 후 어떤 화면으로 연결/이동하지?
    }

    @ApiOperation(value = "회원 개인 정보 통합 조회(마이페이지)")
    @GetMapping("/{user-id}")
    public ResponseEntity getUser(@PathVariable("user-id") @Positive Long userId) {
        /*
        User findUser = userService.findUser(userId);
        return new ResponseEntity<>(userMapper.userToUserDetailResponseDto(findUser), HttpStatus.OK);
         */

        // API 통신용
        return new ResponseEntity<>(createDetailResponseDto(), HttpStatus.OK);
    }

    @ApiOperation(value = "특정 습관 달성 회원 목록 조회(달성 시간 내림차순)")
    @GetMapping("/success")
    public ResponseEntity getSuccessUsersByChallengeCreatedAtDesc(@Positive @RequestParam int page,
                                                                  @Positive @RequestParam int size) {
        // API 통신용
        List<UserDto.SimpleResponse> responseDtos = List.of(createSimpleResponseDto(), createSimpleResponseDto(), createSimpleResponseDto());
        return new ResponseEntity<>(responseDtos, HttpStatus.OK); // todo
    }


    private UserDto.SimpleResponse createSimpleResponseDto() {
        return UserDto.SimpleResponse.builder()
                .userId(1L)
                .email("user1@gmail.com")
                .username("user1번")
                .build();
    }

    private UserDto.PatchResponse createPatchResponseDto() {
        return UserDto.PatchResponse.builder()
                .userId(1L)
                .username("유저no1")
                .password("Abc12&defg")
                .build();
    }

    private UserDto.DetailResponse createDetailResponseDto() {
        return UserDto.DetailResponse.builder()
                .userId(1L)
                .email("user1@gmail.com")
                .username("user1번")
                .biggestNumOfChallengeHabitDays(51)
//                .challengeHabits(List.of(new Challenge(1L, 1L, 1L, null, "C"), new Challenge()))
//                .successHabits()
                .build();
    }

}
