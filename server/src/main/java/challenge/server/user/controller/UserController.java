package challenge.server.user.controller;

import challenge.server.bookmark.service.BookmarkService;
import challenge.server.file.service.FileUploadService;
import challenge.server.habit.entity.Habit;
import challenge.server.security.dto.LogoutDto;
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
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
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
    private final BookmarkService bookmarkService;
    private final FileUploadService fileUploadService;

    @ApiOperation(value = "이메일 중복 여부 확인", notes = "true 응답 = 중복되는 이메일 존재 / false 응답 = 중복되는 이메일 없음")
    @GetMapping("/emails/check")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam @Email String email) {
        return new ResponseEntity<>(userService.verifyExistEmail(email), HttpStatus.OK);

        // API 통신용
        //return ResponseEntity.ok(false);
    }

    @ApiOperation(value = "회원 닉네임 중복 여부 확인", notes = "true 응답 = 중복되는 닉네임 존재 / false 응답 = 중복되는 닉네임 없음")
    @GetMapping("/usernames/check")
    public ResponseEntity<Boolean> checkUsernameDuplicate(@RequestParam @NotBlank String username) {
        return new ResponseEntity<>(userService.verifyExistUsername(username), HttpStatus.OK);

        // API 통신용
        //return new ResponseEntity<>(false, HttpStatus.OK);
    }

    @ApiOperation(value = "회원 가입", notes = "Sign Up 버튼을 클릭할 경우 회원 가입 요청을 보냅니다.")
    @PostMapping
    public ResponseEntity postUser(@Valid @RequestBody UserDto.Post requestBody) {
        User user = userMapper.userPostDtoToUser(requestBody);
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(userMapper.userToUserSimpleResponseDto(createdUser), HttpStatus.CREATED);

        // API 통신용
        //return new ResponseEntity<>(createSimpleResponseDto(), HttpStatus.CREATED);
    }

    /*
    @ApiOperation(value = "회원 프로필 사진 등록")
    @PostMapping("/{user-id}/profiles")
    public ResponseEntity postProfileImage(@PathVariable("user-id") @Positive Long userId,
                                           @RequestPart("file") MultipartFile multipartFile) {
        User userWithProfileImg = userService.addProfileImage(userId, multipartFile);
        return new ResponseEntity<>(userMapper.userToUserSimpleResponseDto(userWithProfileImg), HttpStatus.OK);

        // API 통신용
//        String result = "파일 업로드 성공";
//        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    */

    @ApiOperation(value = "회원 정보 수정")
    @PatchMapping(value = "/{user-id}"/*, consumes = {"multipart/form-data"}*/)
    public ResponseEntity patchUser(@PathVariable("user-id") @Positive Long userId,
                                    @RequestPart(value = "file", required = false) MultipartFile multipartFile,
                                    @RequestPart(value = "data", required = false) @Valid UserDto.Patch patchDto) {
        if (patchDto == null) {
            patchDto = new UserDto.Patch();
        }

        if (multipartFile != null) patchDto.setProfileImageUrl(fileUploadService.save(multipartFile));
        // 위 null 처리로 인해 file, data 둘 다 없이 요청 보내도 요청/응답되긴 함

        patchDto.setUserId(userId);
        User user = userService.updateUser(userMapper.userPatchDtoToUser(patchDto));
        return new ResponseEntity<>(userMapper.userToUserPatchResponseDto(user), HttpStatus.OK);

        // API 통신용
        //return new ResponseEntity<>(createUserPatchResponseDto(), HttpStatus.OK); // todo 회원 정보 수정 후 어떤 화면으로 연결/이동하지?
    }

    @ApiOperation(value = "프로필 사진 삭제")
    @DeleteMapping("/{user-id}/profiles")
    public ResponseEntity deleteProfileImage(@PathVariable("user-id") @Positive Long userId) {
        userService.deleteProfileImage(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // todo 관리자가 처리하거나, 또는 특정 조건이 만족되었을 때에 이벤트 발생시켜 처리
    /*
    @ApiOperation(value = "5회 이상 신고 당한 회원 정지")
    @PatchMapping("/reports/{user-id}")
    public ResponseEntity banUser(@PathVariable("user-id") @Positive Long userId) {
        // API 통신용
        return new ResponseEntity<>(createUserBanResponseDto(), HttpStatus.OK);
    }
     */

    @ApiOperation(value = "회원 개인 정보 통합 조회(마이페이지)")
    @GetMapping("/{user-id}")
    public ResponseEntity getUser(@PathVariable("user-id") @Positive Long userId) {
        UserDto.UserDetailsDb userDetailsDb = userService.findUserDetails(userId);
        return new ResponseEntity<>(userDetailsDb, HttpStatus.OK);

        // API 통신용
        //return new ResponseEntity<>(createUserDetailResponseDto(), HttpStatus.OK);
    }

    /*
    @ApiOperation(value = "내가 진행 중인 습관의 카테고리 조회") // 회원 개인 정보 통합 조회(마이페이지) 시 함께 조회하도록 처리
    @GetMapping("/{user-id}/habits/categories")
    public ResponseEntity getActiveCategories(@PathVariable("user-id") @Positive Long userId) {
        // API 통신용
        List<UserDto.CategoryResponse> responseDtos = List.of(createCategoryResponseDto(), createCategoryResponseDto(), createCategoryResponseDto());
        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }
     */

    /* bookmark(습관 찜하기) 등록 = habit controller에 해당 요청 처리하는 핸들러 메서드 postBookmark() 있음
    userId 및 habitId로 요청,
    비로그인 회원은 로그인 페이지로 이동,
    해당 습관 제작자는 해당 버튼이 보이지 않음
     */
    // 회원이 찜한 습관들의 목록 출력
    @ApiOperation(value = "회원이 찜한 습관들의 목록 출력")
    @GetMapping("/{user-id}/bookmarks")
    public ResponseEntity getBookmarks(@PathVariable("user-id") @Positive Long userId,
                                       @RequestParam @Positive int page,
                                       @RequestParam @Positive int size) {
        List<Habit> habits = bookmarkService.findBookmarkHabits(userId, page, size);
        return new ResponseEntity<>(userMapper.habitsToUserDtoHabitResponses(habits), HttpStatus.OK);

        // API 통신용
//        List<HabitDto.Response> responses = List.of(habitController.createResponseDto(), habitController.createResponseDto(), habitController.createResponseDto(), habitController.createResponseDto(), habitController.createResponseDto());
//        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @ApiOperation(value = "내가 만든 습관 조회")
    @GetMapping("/{user-id}/habits/hosts")
    public ResponseEntity getHostHabits(@PathVariable("user-id") @Positive Long userId,
                                        @RequestParam @Positive int page,
                                        @RequestParam @Positive int size) {
        List<Habit> habits = userService.findHostHabits(userId, page, size);
        return new ResponseEntity(userMapper.habitsToUserDtoHabitResponses(habits), HttpStatus.OK);

        // API 통신용
//        List<UserDto.HabitResponse> responseDtos = List.of(createHabitResponseDto(), createHabitResponseDto());
//        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }

    @ApiOperation(value = "인증서 발급")
    @GetMapping("/{user-id}/habits/{habit-id}/certificates")
    public ResponseEntity getHabitCertificate(@PathVariable("habit-id") @Positive Long habit_id,
                                              @PathVariable("user-id") @Positive Long user_id) {
        UserDto.SuccessHabitCertificate successHabitCertificate = userService.issueHabitCertificate(user_id, habit_id);
        return new ResponseEntity(successHabitCertificate, HttpStatus.OK);

        // API 통신용
//        return new ResponseEntity<>(createSucessHabitCertificate(), HttpStatus.OK);
    }

    /* 2023.1.13(금) 15h10 habit controller가 처리하는 것이 맞음!
    @ApiOperation(value = "특정 습관 달성 회원 목록 조회(달성 시간 내림차순)")
    @GetMapping("/challenges/success")
    public ResponseEntity getSuccessUsers(@Positive @RequestParam int page,
                                          @Positive @RequestParam int size) {
        // API 통신용
        List<UserDto.SimpleResponse> responseDtos = List.of(createUserSimpleResponseDto(), createUserSimpleResponseDto(), createUserSimpleResponseDto());
        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }
     */

    @ApiOperation(value = "비밀번호 일치 여부 확인", notes = "true 응답 = 비밀번호 일치 / false = 비밀번호 불일치")
    @GetMapping("/{user-id}/passwords/check")
    public ResponseEntity<Boolean> checkPasswordCorrect(@PathVariable("user-id") @Positive Long userId,
                                                        @Valid @RequestBody UserDto.CheckPassword requestBody) {
        requestBody.setUserId(userId);
        User user = userMapper.UserCheckPasswordDtoToUser(requestBody);

        return new ResponseEntity<>(userService.verifyExistPassword(user), HttpStatus.OK);
        // API 통신용
//        return ResponseEntity.ok(true);
    }

    @ApiOperation(value = "회원 탈퇴")
    @DeleteMapping("/{user-id}")
    public ResponseEntity deleteUser(@PathVariable("user-id") @Positive Long userId) {
        userService.quitUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

//    @ApiOperation(value = "로그아웃")
//    public ResponseEntity logout(LogoutDto logoutDto) {
//
//    }

}
