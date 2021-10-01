const validateRealName = (userInfo, type) => {
  const regex = /^[A-Za-z0-9\-.\s]+$/;
  const obj = {};
  if (!userInfo.realname || userInfo.realname.trim === '' || userInfo.realname.search(regex) === -1) {
    if (type === 'signup') {
      obj.realname_invalid = 'Please enter a valid name.';
    }
  }
  return obj;
};

const validateUserName = (userInfo, type) => {
  const regex = /^[a-z0-9_]+$/;
  const obj = {};
  if (!userInfo.username || userInfo.username.trim === '') {
    if (type === 'login') {
      obj.username_invalid = 'Please enter a username.';
    } else {
      obj.username_invalid = 'Please enter a valid username.';
    }
  } else if (userInfo.username.search(regex) === -1) {
    if (type === 'signup') {
      obj.username_invalid = 'Your username should only include numbers, lowercase alphabets, and/or underscores.';
    }
  }
  return obj;
};

const validatePassword = (userInfo) => {
  const obj = {};
  if (!userInfo.password || userInfo.password.trim === '' || userInfo.password.length < 8) {
    obj.password_invalid = 'Please enter a valid password of at least 8 characters long.';
  }
  return obj;
};

export const validateUserInfo = (userInfo) => ({
  ...userInfo,
  ...validateRealName(userInfo, 'signup'),
  ...validateUserName(userInfo, 'signup'),
  ...validatePassword(userInfo),
});

export const validateLogin = (userInfo) => ({
  ...userInfo,
  ...validateUserName(userInfo, 'login'),
});
