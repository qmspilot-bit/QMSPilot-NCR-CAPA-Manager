import { getChatGPTUser } from "./chatgpt-auth";
import NcrCapaApp from "./NcrCapaApp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  return (
    <NcrCapaApp
      initialUser={{
        name: user?.fullName ?? "Donald Davidson",
        email: user?.email ?? "qmspilot@gmail.com",
        company: "QMSPilot, LLC",
      }}
    />
  );
}
