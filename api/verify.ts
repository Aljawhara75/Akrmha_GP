const MSG_BASE_API = "https://verify-5914-uzhumh.twil.io/";

const CODE_SENT = {
  success: true,
};

const SUCCESS_MSG = {
  success: true,
  message: "Verification success.",
};

const FAIL_MSG = {
  success: false,
  message: "Incorrect token.",
};

const sendSmsVerification: (phoneNumber: string) => Promise<boolean> = async (
  phoneNumber
) => {
  const E164Matcher = /^\+[1-9]\d{1,14}$/;
  const isValidPhoneNumber = E164Matcher.test(phoneNumber);

  console.log(
    `Verify.ts>sendSmsVerification> isValidPhoneNumber: `,
    isValidPhoneNumber
  );
  console.log(
    `Verify.ts>sendSmsVerification> Param(phoneNumber): `,
    phoneNumber
  );

  if (isValidPhoneNumber) {
    try {
      const data = JSON.stringify({
        to: `${phoneNumber}`,
        channel: "sms",
      });

      const response = await fetch(`${MSG_BASE_API}start-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      const json = await response.json();
      console.log(`sendSmsVerification > `, JSON.stringify(json, null, 2));

      if (!json.success) {
        console.error("Error: ", json.success);
        throw new Error(json.success);
      }
      return json.success;
    } catch (error) {
      console.error("Error: ", error);

      return false;
    }
  } else {
    console.error("Invalid phone number.");
    return false;
  }
};

const checkVerification: (
  phoneNumber: string,
  code: string
) => Promise<boolean> = async (phoneNumber, code) => {
  try {
    const data = JSON.stringify({
      to: `${phoneNumber}`,
      code,
    });
    const response = await fetch(`${MSG_BASE_API}check-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const json = await response.json();

    if (!json.success) {
      console.error("Error: ", json.success);
    }

    return json.success;
  } catch (error) {
    console.error("Check Code Error: ", error);
    return false;
  }
};

const sendSmsVerificationMock: (
  phoneNumber: string
) => Promise<boolean> = async (phoneNumber) => {
  const E164Matcher = /^\+[1-9]\d{1,14}$/;
  const isValidPhoneNumber = E164Matcher.test(phoneNumber);

  if (isValidPhoneNumber) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a successful response from the server
        const json = { success: true };
        resolve(json.success);
      }, 1000);
    });
  } else {
    console.error("Invalid phone number.");
    return false;
  }
};

const checkVerificationMock: (
  phoneNumber: string,
  code: string
) => Promise<boolean> = async (phoneNumber, code) => {
  console.log(`phoneNumber, code`, phoneNumber, code);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a response from the server
      const json = code === "000000" ? SUCCESS_MSG : FAIL_MSG;
      resolve(json.success);
    }, 1000);
  });
};

export {
  sendSmsVerification,
  checkVerification,
  sendSmsVerificationMock,
  checkVerificationMock,
};
