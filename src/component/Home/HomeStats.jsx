import { memo } from "react";
import { TrustMarquee } from "../TrustMarquee/TrustMarquee";

export const HomeStats = memo(function HomeStats() {
  return (
    <section className="home-stats" aria-labelledby="trust-marquee-heading">
      <div className="home-stats__glow" aria-hidden="true" />
      <div className="home-stats__inner home-stats__inner--marquee">
        <TrustMarquee embedded />
      </div>
    </section>
  );
});
