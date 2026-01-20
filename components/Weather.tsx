import { forecastsItem, KansokuID } from "../app/types";
import kansokuIDsData from "@/public/list.json"

export default async function Page() {
    const data = kansokuIDsData as KansokuID;
    //const cityCode = data["沖縄"]["那覇"];
    const url3 = `https://weather.tsukumijima.net/api/forecast/city/${data["沖縄県"]["那覇"]}`;
    const res3 = await fetch( url3, {cache: "no-cache" });
    const data3 = await res3.json();
    const forecastsList: forecastsItem[] = data3.forecasts || [];

    

    return (
        <div style={{ marginRight: "500px", padding: "25px 25px", backgroundColor: "rgb(100 100 100 / 0.2)", borderRadius: "30px" }}>
        <p style={{ fontSize: "25px" }}>{data3.title}</p>

        <div style={{ display: "flex", gap: "20px" }}>
          {forecastsList.map((fore) => (
            <div key={fore.date} style={{ padding: "17px", margin: "15px", width: "400px", backgroundColor: "rgb(255 255 255)", borderRadius: "30px" }}>
              <h3 style={{fontSize: "22px"}}>{fore.dateLabel}</h3>
              <div style={{display: "flex"}}>
                <img src={fore.image.url} alt= {fore.image.alt} style={{ width: "85px", marginRight: "10px" }} />
                <div>
                  <h2 style={{ marginBottom: "-5px", fontSize: "28px" }}>{fore.telop}</h2>
                  <div style={{display: "flex"}}>
                    <p style={{margin: "5px 0", color: "red"}}>最高 {fore.temperature.max?.celsius ?? "-"}℃</p>
                    <p style={{margin: "5px 20px", color: "blue"}}>最低 {fore.temperature.min?.celsius ?? "-"}℃</p>
                  </div>
                </div>
              </div>
              <p style={{marginTop: "0px"}}>{fore.detail.weather}</p>
            </div>
          ))}
        </div>
      </div>
    )
}