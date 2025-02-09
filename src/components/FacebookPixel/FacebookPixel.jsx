"use client";
import { useEffect } from "react";
import { getDataByDocName } from "@/service/Firebase/getFirestore";

const FacebookPixel = () => {
  useEffect(() => {
    const loadPixel = async () => {
      const data = await getDataByDocName("settings", "facebook-pixel");
      if (data?.pixelId) {
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = "https://connect.facebook.net/en_US/fbevents.js";
          s = b.getElementsByTagName(e)[0];
          s?.parentNode?.insertBefore(t, s);
        })(window, document, "script");

        window.fbq("init", data.pixelId);
        window.fbq("track", "PageView");
      }
    };

    loadPixel();
  }, []);

  return <></>; // JSX requires a valid return statement, so we return an empty fragment.
};

export default FacebookPixel;
