"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  // Debounced search handler
  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    100
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => handleSearch.cancel();
  }, []);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}

        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks.length > 0 ? <h2>Tasks</h2> : null}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects.length > 0 ? <h2>Projects</h2> : null}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users.length > 0 ? <h2>Users</h2> : null}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}

            {/* Fallback when no results */}
            {Object.values(searchResults).every(
              (arr) => !arr || arr.length === 0
            ) && <p>No results found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
