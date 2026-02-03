import React from "react";
import { FixedSizeList as List } from "react-window";
import { useDashboardData } from "../hooks/useDashboardData";
import "./Dashboard.css";

type User = {
  login: { uuid: string };
  name: { first: string; last: string };
  dob: { age: number };
  location: { city: string; country: string };
  picture: { thumbnail: string };
};

const UserRow: React.FC<{ index: number; style: React.CSSProperties; data: User[] }> = ({ index, style, data }) => {
  const user = data[index];
  return (
    <div className="user-card" style={style} key={user.login.uuid}>
      <img
        src={user.picture.thumbnail}
        alt={`${user.name.first} ${user.name.last}`}
        className="user-avatar"
      />
      <div className="user-info">
        <div className="user-name">
          {user.name.first} {user.name.last}
        </div>
        <div className="user-meta">
          <span>Age: {user.dob.age}</span>
          <span>
            {user.location.city}, {user.location.country}
          </span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { users, loadingUsers, errorUsers, apiStates, apiConfigs } = useDashboardData();

  return (
    <section className="dashboard">
      <h2 className="dashboard-title">User List </h2>
      {loadingUsers && <div className="dashboard-loading">Loading users...</div>}
      {errorUsers && <div className="dashboard-error">{errorUsers}</div>}
      {!loadingUsers && !errorUsers && (
        <div className="user-list-virtualized professional-scroll">
          <List
            height={600}
            width={820}
            itemCount={users.length}
            itemSize={90}
            itemData={users}
          >
            {UserRow}
          </List>
        </div>
      )}

      <section className="dashboard-analytics">
        <h3 className="dashboard-analytics-title">Other Data (Fetched Asynchronously)</h3>
        <div className="dashboard-api-list">
          {apiConfigs.slice(1).map((api, idx) => {
            const state = apiStates[idx] || { loading: true, error: null, data: null };
            return (
              <div key={api.name} className="dashboard-api-block">
                <span className="dashboard-api-name">{api.name}</span>
                {state.loading && <span className="dashboard-loading">Loading...</span>}
                {state.error && <span className="dashboard-error">{state.error}</span>}
                {state.data && (
                  <span className="dashboard-success">
                    Loaded {Array.isArray(state.data) ? state.data.length : "data"} records.
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
