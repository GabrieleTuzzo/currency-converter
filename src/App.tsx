import './App.css';
import Currency from './components/Currency';

function App() {
    return (
        <div>
            <Currency inputType="from" />
            <Currency inputType="to" />
        </div>
    );
}

export default App;
