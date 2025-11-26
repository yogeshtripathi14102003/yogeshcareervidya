  import Topbar from "@/app/WP/Topbar";
import Slider from "@/app/WP/Slider";
import Counter from "@/app/WP/Counter";
import Keyand from "@/app/WP/Keyand";
import Topuniversities from "@/app/WP/Topuniversities";
import Programand from "@/app/WP/Programand";
import Choose from "@/app/WP/Choose";
import FAQ from "@/app/WP/FAQ";
export default function Home() {
  return (
    <>
      <Topbar />
<Slider />
<Counter />
<Keyand />
<Topuniversities/>
<Programand />
<Choose />
<FAQ />
      {/* Your Hero Section below this */}
    </>
  );
}
