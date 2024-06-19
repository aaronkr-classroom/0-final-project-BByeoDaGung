"use strict";

const Talk = require("../models/Talk"); // 사용자 모델 요청

module.exports = {
  index: (req, res, next) => {
    Talk.find() // index 액션에서만 퀴리 실행
      .then((talks) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.talks = talks; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching talks: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  indexView: (req, res) => {
    res.render("talks/index", {
      page: "talks",
      title: "All Talks",
    }); // 분리된 액션으로 뷰 렌더링
  },

  new: (req, res) => {
    res.render("talks/new", {
      page: "new-talk",
      title: "New Talk",
    });
  },

  create: (req, res, next) => {
    let talkParams = {
      meta: {
        title: req.body["meta.title"],
        subtitle: req.body["meta.subtitle"],
        abstractOneLine: req.body["meta.abstractOneLine"],
        abstract: req.body["meta.abstract"],
        keywords: req.body["meta.keywords"],
      },
      given: {
        date: req.body["given.date"],
        location: {
          name: req.body["given.location.name"],
          korean: req.body["given.location.korean"],
          url: req.body["given.location.url"],
        },
        organization: {
          name: req.body["given.organization.name"],
          korean: req.body["given.organization.korean"],
          url: req.body["given.organization.url"],
        },
        event: {
          name: req.body["given.event.name"],
          korean: req.body["given.event.korean"],
          url: req.body["given.event.url"],
        },
      },
      links: {
        code: req.body.code,
        slides: req.body.slides,
        article: req.body.article,
      },
      talkImg: req.body.talkImg,
      user: req.body.userId,
    };
    // 폼 파라미터로 사용자 생성
    Talk.create(talkParams)
      .then((talk) => {
        res.locals.redirect = "/talks";
        res.locals.talk = talk;
        next();
      })
      .catch((error) => {
        console.log(`Error saving talk: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let talkId = req.params.id; // request params로부터 사용자 ID 수집
    Talk.findById(talkId) // ID로 사용자 찾기
      .then((talk) => {
        res.locals.talk = talk; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching talk by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  showView: (req, res) => {
    res.render("talks/show", {
      page: "talk-details",
      title: "Talk Details",
    });
  },

  edit: (req, res, next) => {
    let talkId = req.params.id;
    Talk.findById(talkId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((talk) => {
        res.render("talks/edit", {
          talk: talk,
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching talk by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let talkId = req.params.id,
      talkParams = {
        meta: {
          title: req.body["meta.title"],
          subtitle: req.body["meta.subtitle"],
          abstractOneLine: req.body["meta.abstractOneLine"],
          abstract: req.body["meta.abstract"],
          keywords: req.body["meta.keywords"],
        },
        given: {
          date: req.body["given.date"],
          location: {
            name: req.body["given.location.name"],
            korean: req.body["given.location.korean"],
            url: req.body["given.location.url"],
          },
          organization: {
            name: req.body["given.organization.name"],
            korean: req.body["given.organization.korean"],
            url: req.body["given.organization.url"],
          },
          event: {
            name: req.body["given.event.name"],
            korean: req.body["given.event.korean"],
            url: req.body["given.event.url"],
          },
        },
        links: {
          code: req.body.code,
          slides: req.body.slides,
          article: req.body.article,
        },
        talkImg: req.body.talkImg,
        user: req.body.userId,
      };

    Talk.findByIdAndUpdate(talkId, {
      $set: talkParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((talk) => {
        res.locals.redirect = `/talks/${talkId}`;
        res.locals.talk = talk;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating talk by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let talkId = req.params.id;
    Talk.findByIdAndRemove(talkId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/talks";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting talk by ID: ${error.message}`);
        next();
      });
  },
};
