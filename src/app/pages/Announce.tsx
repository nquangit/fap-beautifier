import { Link } from "react-router-dom";
import Toolbar from "../../_metronic/layout/components/toolbar/Toolbar";
import { usePageDataCustom } from "../../_metronic/layout/core";

const Announce = () => {
  const { title, content } = usePageDataCustom({
    title: (original) => {
      const titleElement = original?.querySelector(
        "table tbody tr:first-child td div center span"
      ) as HTMLElement;
      return titleElement?.textContent?.trim() || "";
    },
    content: (original) => {
      const contentElement = original?.querySelector(
        "table tbody tr:first-child td div span:nth-child(2)"
      ) as HTMLElement;
      return contentElement?.innerHTML;
    },
  });

  return (
    <>
      <Toolbar title={"Thông báo"} breadcrum="Announce" />
      <div className="app-content flex-column-fluid">
        <div className="app-container  container-fluid ">
          <div className="card">
            <div className="card-body p-lg-17">
              <div className="text-center mb-15">
                <h3 className="fs-2x text-gray-900 mb-2">{title}</h3>
                <div
                  className="fs-5 text-muted fw-semibold"
                  dangerouslySetInnerHTML={{ __html: content ?? "" }}
                ></div>

                <Link to="/Student.aspx" className="btn btn-primary mt-8">
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Announce;
