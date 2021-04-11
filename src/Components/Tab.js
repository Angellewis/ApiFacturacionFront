import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
class Tab extends React.Component {
  render() {
    if (this.props.isSelected) {
      return (
        <div>
          { this.props.children}
        </div>
      );
    }
    return null;
  }
}
export default Tab;