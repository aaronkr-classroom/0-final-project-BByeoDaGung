"use strict";

const Train = require("../models/Train"); // 사용자 모델 요청

module.exports = {
  index: (req, res, next) => {
    Train.find() // index 액션에서만 퀴리 실행
      .then((trains) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.trains = trains; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching trains: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  indexView: (req, res) => {
    res.render("trains/index", {
      page: "trains",
      title: "All Trains",
    }); // 분리된 액션으로 뷰 렌더링
  },

  new: (req, res) => {
    res.render("trains/new", {
      page: "new-train",
      title: "New Train",
    });
  },

  create: (req, res, next) => {
    let trainParams = {
      title: req.body.title,
      description: req.body.description,
      button: req.body.button,
      trainImg: req.body.trainImg,
      modalText: req.body.modalText,
    };
    // 폼 파라미터로 사용자 생성
    Train.create(trainParams)
      .then((train) => {
        res.locals.redirect = "/trains";
        res.locals.train = train;
        next();
      })
      .catch((error) => {
        console.log(`Error saving train: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let trainId = req.params.id; // request params로부터 사용자 ID 수집
    Train.findById(trainId) // ID로 사용자 찾기
      .then((train) => {
        res.locals.train = train; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching train by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  showView: (req, res) => {
    res.render("trains/show", {
      page: "train-details",
      title: "Train Details",
    });
  },

  edit: (req, res, next) => {
    let trainId = req.params.id;
    Train.findById(trainId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((train) => {
        res.render("trains/edit", {
          train: train,
          page: "edit-train",
          title: "Edit Train",
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching train by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let trainId = req.params.id,
      trainParams = {
        title: req.body.title,
        description: req.body.description,
        button: req.body.button,
        trainImg: req.body.trainImg,
        modalText: req.body.modalText,
      };

    Train.findByIdAndUpdate(trainId, {
      $set: trainParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((train) => {
        res.locals.redirect = `/trains/${trainId}`;
        res.locals.train = train;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating train by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let trainId = req.params.id;
    Train.findByIdAndRemove(trainId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/trains";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting train by ID: ${error.message}`);
        next();
      });
  },
};
