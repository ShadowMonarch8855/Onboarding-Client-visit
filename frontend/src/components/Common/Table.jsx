import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data, loading, emptyMessage = "No data available" }) => {
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data || data.length === 0) return <div className={styles.empty}>{emptyMessage}</div>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
