package challenge.server.habit.service;

import challenge.server.exception.BusinessLogicException;
import challenge.server.exception.ExceptionCode;
import challenge.server.file.service.FileUploadService;
import challenge.server.habit.entity.Habit;
import challenge.server.habit.repository.HabitRepository;
import challenge.server.utils.CustomBeanUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitService {

    private final CustomBeanUtils<Habit> beanUtils;
    private final HabitRepository habitRepository;
    private final FileUploadService fileUploadService;

    @Transactional
    public Habit createHabit(Habit habit) {
        return habitRepository.save(habit);
    }

    @Transactional
    public Habit updateHabit(Habit habit) {
        Habit findHabit = findVerifiedHabit(habit.getHabitId());
        Habit updatingHabit = beanUtils.copyNonNullProperties(habit, findHabit);

        return habitRepository.save(updatingHabit);
    }

    public Habit findHabit(Long habitId) {
        return findVerifiedHabit(habitId);
    }

    // 전체 습관 조회
    public List<Habit> findAll(Long lastHabitId, int page, int size) {
        return habitRepository.findAllNoOffset(lastHabitId, page, size);
    }

    // 제목 keyword로 검색(조회)
    public List<Habit> findAllByKeyword(Long lastHabitId, String keyword, int page, int size) {
        return habitRepository.findByTitleIsContaining(lastHabitId, keyword, page, size);
    }

    // 특정 카테고리의 습관 조회
    public List<Habit> findAllByCategory(Long lastHabitId, Long categoryId, int page, int size) {
        return habitRepository.findByCategory(lastHabitId, categoryId, page, size);
    }

    public List<Habit> findAllByScore(Long lastHabitId, int page, int size) {
        return habitRepository.findAllByScore(lastHabitId, page, size);
    }

    public List<Habit> findAllByPopularity(Long lastHabitId, int page, int size) {
        return habitRepository.findAllByPopularity(lastHabitId, page, size);
    }

    public List<Habit> findAllByNewest(Long lastHabitId, int page, int size) {
        return habitRepository.findAllByNewest(lastHabitId, page, size);
    }

    // 특정 사용자(작성자)가 만든 습관 조회
    public List<Habit> findAllByUser(Long lastHabitId, Long userId, int page, int size) {
        return habitRepository.findByHostUserId(lastHabitId, userId, page, size);
    }

    @Transactional
    public void deleteHabit(Long habitId) {
        Habit habit = findVerifiedHabit(habitId);
        fileUploadService.delete(habit.getThumbImgUrl());
        fileUploadService.delete(habit.getSuccImgUrl());
        fileUploadService.delete(habit.getFailImgUrl());
        habitRepository.delete(habit);
    }

    public Habit findVerifiedHabit(Long habitId) {
        return habitRepository.findById(habitId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.HABIT_NOT_FOUND));
    }

    @Transactional
    public void calcAvgScore(Long habitId) {
        Habit habit = findVerifiedHabit(habitId);
        habit.calcAvgScore();
    }
}
