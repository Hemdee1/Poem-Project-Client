import { useState } from "react";
import { useGlobalContext } from "../components/context";
import PoemCard from "../components/poemCard";

const Search = () => {
  const { poems } = useGlobalContext();

  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [searchPoems, setSearchPoems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchPoems([]);

    switch (searchBy) {
      case "title":
        setSearchPoems(
          poems.filter((poem) =>
            poem.title.toLowerCase().includes(searchText.toLowerCase())
          )
        );
        break;

      case "poet":
        setSearchPoems(
          poems.filter((poem) =>
            poem.user_penName.toLowerCase().includes(searchText.toLowerCase())
          )
        );
        break;

      case "category":
        setSearchPoems(
          poems.filter((poem) =>
            poem.category.includes(searchText.toLowerCase())
          )
        );
        break;

      default:
        setSearchPoems([]);
        break;
    }
  };

  return (
    <section className="search">
      <h1 className="title">Search poems</h1>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="search"
            placeholder="enter search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn">Submit</button>
        </div>
        <select
          name="search"
          id="search"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="title">search by title</option>
          <option value="poet">search by poet</option>
          <option value="category">search by category</option>
        </select>
      </form>

      <div className="poem-container">
        {searchPoems.map((poem, index) => (
          <PoemCard key={index} poem={poem} />
        ))}
      </div>
    </section>
  );
};

export default Search;
